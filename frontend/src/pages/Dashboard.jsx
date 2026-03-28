import { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [audio, setAudio] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const cleanText = (text) => {
    return text.replace(/\*\*/g, "");
  };

  const handleSubmit = async () => {
    if (!resume || !audio) {
      alert("Upload both files");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("audio", audio);

    try {
      setLoading(true);

      // 🔥 IMPORTANT: Node API (NOT FastAPI)
      const res = await axios.post(
        "http://localhost:5000/api/analyze",
        formData
      );

      setResult(res.data.report); // 👈 Node se report aata hai

    } catch (err) {
      console.error(err);
      alert("Error analyzing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🚀 AI Interview Analyzer</h1>

      <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
      <input type="file" accept=".wav" onChange={(e) => setAudio(e.target.files[0])} />

      <button onClick={handleSubmit}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
  <div className="result-container">

    <h2>📊 Analysis Result</h2>

    {/* 🔥 SCORE CARDS */}
    <div className="cards">
      <div className="card">Resume: {result.resumeScore}</div>
      <div className="card">Voice: {result.voiceScore}</div>
      <div className="card">Final: {result.finalScore}</div>
    </div>

    {/* 🔥 PROGRESS BAR */}
    <div className="progress">
      <div
        className="progress-fill"
        style={{ width: `${result.finalScore}%` }}
      >
        {result.finalScore}%
      </div>
    </div>

    {/* 🔥 SKILLS */}
    <h3>Skills</h3>
    <div className="skills">
    {Array.isArray(result.resumeData.skills) &&
    result.resumeData.skills.map((s, i) => (
      <span key={i} className="skill">{s}</span>
    ))}
    </div>

    {/* 🔥 AI RESUME */}
    <h3>AI Resume Feedback</h3>
    <div className="box">
      {cleanText(result.aiResume)}
    </div>

    {/* 🔥 AI VOICE */}
    <h3>AI Voice Feedback</h3>
    <div className="box">
      {cleanText(result.aiVoice)}
    </div>

  </div>
)}
    </div>
  );
};

export default Dashboard;