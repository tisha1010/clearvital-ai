const mongoose = require("mongoose");

const sessionEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["register", "login", "logout"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SessionEvent", sessionEventSchema);
