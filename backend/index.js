const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const markerCatalog = require("./markerCatalog");
const Report = require("./models/Report");
const SessionEvent = require("./models/SessionEvent");
const User = require("./models/User");

dotenv.config();

const {
  generateAnalysisCopy,
  generateChatReply,
  isAiConfigured,
  aiProvider,
  aiModel,
} = require("./services/aiClient");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "medical";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use(express.json());

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return {
    passwordHash,
    passwordSalt: salt,
  };
}

function verifyPassword(password, user) {
  const { passwordHash } = hashPassword(password, user.passwordSalt);
  return crypto.timingSafeEqual(
    Buffer.from(passwordHash, "hex"),
    Buffer.from(user.passwordHash, "hex")
  );
}

function deriveInterpretation(markerKey, value) {
  const marker = markerCatalog[markerKey];

  if (!marker) {
    return null;
  }

  if (!Number.isFinite(value) || value <= 0) {
    return {
      status: "No reading",
      severity: "neutral",
      referenceRange: `${marker.low} - ${marker.high} ${marker.unit}`,
    };
  }

  if (value < marker.criticalLow) {
    return {
      status: "Critically low",
      severity: "critical",
      referenceRange: `${marker.low} - ${marker.high} ${marker.unit}`,
    };
  }

  if (value < marker.low) {
    return {
      status: "Below range",
      severity: "warning",
      referenceRange: `${marker.low} - ${marker.high} ${marker.unit}`,
    };
  }

  if (value <= marker.high) {
    return {
      status: "In range",
      severity: "good",
      referenceRange: `${marker.low} - ${marker.high} ${marker.unit}`,
    };
  }

  return {
    status: "Above range",
    severity: "elevated",
      referenceRange: `${marker.low} - ${marker.high} ${marker.unit}`,
  };
}

async function resolveCurrentUser(req) {
  const userId = req.header("x-user-id");

  if (!userId || !mongoose.isValidObjectId(userId)) {
    return null;
  }

  return User.findById(userId);
}

app.get("/api/health", async (_req, res) => {
  const dbState =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.json({
    status: "ok",
    database: dbState,
    dbName: mongoose.connection.name || MONGO_DB_NAME,
    collections: ["reports", "users", "sessionevents"],
    mongoUri: MONGO_URI,
    ai: {
      configured: isAiConfigured(),
      provider: aiProvider,
      model: aiModel,
    },
    supportedMarkers: Object.values(markerCatalog).map((marker) => ({
      key: marker.key,
      label: marker.label,
      unit: marker.unit,
      low: marker.low,
      high: marker.high,
    })),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const user = await resolveCurrentUser(req);

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message for the chatbot.",
      });
    }

    if (!isAiConfigured()) {
      return res.status(503).json({
        error: "AI chat is not configured yet. Add GEMINI_API_KEY in backend/.env and restart the backend.",
      });
    }

    try {
      const recentReports = user
        ? await Report.find({ userId: user._id })
            .sort({ createdAt: -1 })
          .limit(5)
          .lean()
        : [];
      const reply = await generateChatReply({
        message,
        userName: user?.name || "Guest",
        reports: recentReports,
      });

      if (!String(reply || "").trim()) {
        return res.status(502).json({
          error: "AI chat is available but returned an empty reply.",
        });
      }

      return res.json({
        reply,
      });
    } catch (error) {
      console.error("Chat AI error:", error.message);
      return res.status(error.status || 502).json({
        error: error.message || "AI chat is available but failed to generate a reply right now.",
      });
    }
  } catch (error) {
    console.error("Chat route error:", error.message);
    res.status(500).json({
      error: "Unable to process the chat request right now.",
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    if (!name || !email || password.length < 6) {
      return res.status(400).json({
        error: "Name, email, and a password of at least 6 characters are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    const { passwordHash, passwordSalt } = hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      passwordSalt,
      lastLoginAt: new Date(),
    });

    await SessionEvent.create({
      userId: user._id,
      email: user.email,
      action: "register",
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register route error:", error.message);
    res.status(500).json({
      error: "Unable to create the account right now.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || "");

    const user = await User.findOne({ email });

    if (!user || !verifyPassword(password, user)) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    await SessionEvent.create({
      userId: user._id,
      email: user.email,
      action: "login",
    });

    res.json({
      message: "Login successful.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login route error:", error.message);
    res.status(500).json({
      error: "Unable to log in right now.",
    });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    const user = await resolveCurrentUser(req);

    if (!user) {
      return res.status(400).json({
        error: "No active user session was provided.",
      });
    }

    await SessionEvent.create({
      userId: user._id,
      email: user.email,
      action: "logout",
    });

    res.json({
      message: "Logout saved.",
    });
  } catch (error) {
    console.error("Logout route error:", error.message);
    res.status(500).json({
      error: "Unable to log out right now.",
    });
  }
});

app.get("/api/auth/me", async (req, res) => {
  try {
    const user = await resolveCurrentUser(req);

    if (!user) {
      return res.status(401).json({
        error: "No authenticated user found.",
      });
    }

    res.json({
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Auth me route error:", error.message);
    res.status(500).json({
      error: "Unable to fetch the current user.",
    });
  }
});

app.post("/api/reports/analyze", async (req, res) => {
  try {
    const markerKey = String(req.body?.markerKey || "hemoglobin").trim().toLowerCase();
    const inputValue = Number(req.body?.value);
    const user = await resolveCurrentUser(req);
    const marker = markerCatalog[markerKey];

    if (!marker) {
      return res.status(400).json({
        error: "Unsupported marker selected.",
      });
    }

    if (!Number.isFinite(inputValue) || inputValue <= 0) {
      return res.status(400).json({
        error: `Please provide a valid ${marker.label.toLowerCase()} value greater than 0.`,
      });
    }

    const interpretation = deriveInterpretation(markerKey, inputValue);

    if (!isAiConfigured()) {
      return res.status(503).json({
        error: "AI analysis is not configured yet. Add GEMINI_API_KEY in backend/.env and restart the backend.",
      });
    }

    const dynamicCopy = await generateAnalysisCopy({
      marker,
      value: inputValue,
      interpretation,
    });

    if (!dynamicCopy) {
      return res.status(502).json({
        error: "AI analysis is available but did not return a usable result.",
      });
    }

    const report = await Report.create({
      marker: marker.label,
      markerKey,
      value: inputValue,
      unit: marker.unit,
      referenceRange: interpretation.referenceRange,
      status: interpretation.status,
      severity: interpretation.severity,
      explanation: dynamicCopy.explanation,
      note: dynamicCopy.note,
      source: dynamicCopy.source,
      userId: user?._id || null,
      userName: user?.name || "Guest",
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Analyze route error:", error.message);
    res.status(error.status || 500).json({
      error: error.message || "Unable to analyze and save the report right now.",
    });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    const user = await resolveCurrentUser(req);
    const query = user ? { userId: user._id } : {};

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json(reports);
  } catch (error) {
    console.error("Fetch reports error:", error.message);
    res.status(500).json({
      error: "Unable to fetch reports right now.",
    });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });
    console.log(`MongoDB connected to ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
