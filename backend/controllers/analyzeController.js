import axios from "axios";
import FormData from "form-data";
import Report from "../models/reportModel.js";

// 🔥 VOICE SCORE
const getVoiceScore = (voice) => {
  let score = 0;

  if (voice.confidence === "High") score += 40;
  else if (voice.confidence === "Medium") score += 25;
  else score += 10;

  if (voice.fluency === "Good") score += 40;
  else if (voice.fluency === "Average") score += 25;
  else score += 10;

  if (voice.speed === "Normal") score += 20;
  else score += 10;

  return score; // /100
};

// 🔥 AI SCORE
const getAIScore = (aiText) => {
  if (!aiText) return 50;

  const text = aiText.toLowerCase();

  if (text.includes("excellent")) return 90;
  if (text.includes("good")) return 75;
  if (text.includes("improve")) return 60;

  return 50;
};

// 🔥 FACE SCORE (NEW)
const getFaceScore = (face) => {
  if (!face || !face.confidence) return 50;

  if (face.confidence === "High") return 85;
  if (face.confidence === "Medium") return 70;

  return 50;
};

export const analyzeController = async (req, res) => {
  try {
    if (!req.files || !req.files.resume || !req.files.audio) {
      return res.status(400).json({ message: "Resume or audio file missing" });
    }

    const formData = new FormData();

    // 🔹 Files append
    formData.append(
      "resume",
      req.files.resume[0].buffer,
      req.files.resume[0].originalname
    );

    formData.append(
      "audio",
      req.files.audio[0].buffer,
      req.files.audio[0].originalname
    );
    formData.append("job_description", req.body.job_description || "");
    // 🔥 VIDEO (OPTIONAL)
    if (req.files.video) {
      formData.append(
        "video",
        req.files.video[0].buffer,
        req.files.video[0].originalname
      );
    }

    // 🔹 FastAPI call
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-full",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const data = response.data;

    // 🔥 SCORES
    const voiceScore = getVoiceScore(data.voice || {});
    const aiScore = getAIScore(data.ai_resume_analysis);
    const faceScore = getFaceScore(data.face || {});

    const finalScore =
  data.resume.score * 0.4 +
  voiceScore * 0.25 +
  faceScore * 0.25 +
  aiScore * 0.1;
    // 🔥 SAVE DB
    const report = await Report.create({
      userId: req.user._id,

      resumeScore: data.resume.score,
      voiceScore: Math.round(voiceScore),
      faceScore: Math.round(faceScore),
      finalScore: Math.round(finalScore),

      resumeData: data.resume,
      voiceData: data.voice,
      faceData: data.face,

      aiResume: data.ai_resume_analysis,
      aiVoice: data.ai_voice_analysis,
    });

    res.status(200).json({
      message: "Analysis complete & saved",
      report,
    });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "Error in analysis",
      error: error.message,
    });
  }
};