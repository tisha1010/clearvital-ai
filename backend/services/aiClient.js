const axios = require("axios");

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const AI_PROVIDER =
  process.env.AI_PROVIDER ||
  (OPENROUTER_API_KEY ? "openrouter" : GEMINI_API_KEY ? "gemini" : "openrouter");

function isAiConfigured() {
  if (AI_PROVIDER === "openrouter") {
    return Boolean(OPENROUTER_API_KEY);
  }

  if (AI_PROVIDER === "gemini") {
    return Boolean(GEMINI_API_KEY);
  }

  return false;
}

function cleanModelText(text) {
  return String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function parseJsonObject(text) {
  const cleaned = cleanModelText(text);
  const startIndex = cleaned.indexOf("{");
  const endIndex = cleaned.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null;
  }

  try {
    return JSON.parse(cleaned.slice(startIndex, endIndex + 1));
  } catch {
    return null;
  }
}

function extractGeminiText(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => part?.text || "")
    .join("")
    .trim();
}

function extractOpenRouterText(payload) {
  return String(payload?.choices?.[0]?.message?.content || "").trim();
}

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
        },
      },
      {
        timeout: 20000,
      }
    );

    return extractGeminiText(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const providerMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown Gemini API error";
    const wrappedError = new Error(`Gemini API error (${status}): ${providerMessage}`);

    wrappedError.status = status;
    throw wrappedError;
  }
}

async function callOpenRouter(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.CLIENT_ORIGIN || "http://localhost:5173",
          "X-Title": "MedExplain AI",
        },
        timeout: 25000,
      }
    );

    return extractOpenRouterText(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const providerMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown OpenRouter API error";
    const wrappedError = new Error(`OpenRouter API error (${status}): ${providerMessage}`);

    wrappedError.status = status;
    throw wrappedError;
  }
}

async function callAi(prompt) {
  if (AI_PROVIDER === "openrouter") {
    return callOpenRouter(prompt);
  }

  if (AI_PROVIDER === "gemini") {
    return callGemini(prompt);
  }

  throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
}

async function generateAnalysisCopy({ marker, value, interpretation }) {
  if (!isAiConfigured()) {
    return null;
  }

  const prompt = `
You are a careful medical report explainer for a patient-facing health app.
Do not diagnose. Do not claim certainty. Keep the response calm, clear, and concise.

Marker: ${marker.label}
Value: ${value} ${marker.unit}
Reference range: ${marker.low} to ${marker.high} ${marker.unit}
Computed status: ${interpretation.status}
Computed severity: ${interpretation.severity}

Return valid JSON only with this shape:
{
  "explanation": "2 to 3 short sentences in plain English",
  "note": "1 short practical follow-up note"
}
`;

  const text = await callAi(prompt);
  const parsed = parseJsonObject(text);

  if (!parsed?.explanation || !parsed?.note) {
    return null;
  }

  return {
    explanation: String(parsed.explanation).trim(),
    note: String(parsed.note).trim(),
    source:
      AI_PROVIDER === "openrouter"
        ? `OpenRouter (${OPENROUTER_MODEL})`
        : `Gemini (${GEMINI_MODEL})`,
  };
}

async function generateChatReply({ message, userName, reports }) {
  if (!isAiConfigured()) {
    return null;
  }

  const recentReports = Array.isArray(reports)
    ? reports.map((report) => ({
        marker: report.marker,
        value: report.value,
        unit: report.unit,
        status: report.status,
        createdAt: report.createdAt,
      }))
    : [];

  const prompt = `
You are the in-app health report assistant for a lab analysis dashboard.
The user is named ${userName || "Guest"}.
Answer in plain English.
Keep replies to 3 short paragraphs or less.
Be helpful, calm, and practical.
Do not diagnose or replace a clinician.

Recent saved reports:
${JSON.stringify(recentReports, null, 2)}

User message:
${message}
`;

  const text = await callAi(prompt);
  return cleanModelText(text);
}

module.exports = {
  generateAnalysisCopy,
  generateChatReply,
  isAiConfigured,
  aiProvider: AI_PROVIDER,
  aiModel: AI_PROVIDER === "openrouter" ? OPENROUTER_MODEL : GEMINI_MODEL,
};
