import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  resumeScore: Number,
  voiceScore: Number,
  faceScore: Number,
  finalScore: Number,

  resumeData: Object,
  voiceData: Object,
  faceData: Object,

  aiResume: String,
  aiVoice: String,

  // 🔥 NEW FIELD
  jobDescription: {
    type: String,
    default: ""
  }

}, { timestamps: true });

export default mongoose.model("Report", reportSchema);