import { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [resume, setResume] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resume || !audio) {
      alert("Upload resume & audio");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("audio", audio);

    if (video) {
      formData.append("video", video);
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data.report);

    } catch (err) {
      console.error(err);
      alert("Error analyzing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Interview Analyzer</h1>

      <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
      <br /><br />

      <input type="file" accept=".wav" onChange={(e) => setAudio(e.target.files[0])} />
      <br /><br />

      <input type="file" accept=".mp4" onChange={(e) => setVideo(e.target.files[0])} />
      <br /><br />

      <button onClick={handleSubmit}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Result</h2>

          <p><b>Resume Score:</b> {result.resumeScore}</p>
          <p><b>Voice Score:</b> {result.voiceScore}</p>
          <p><b>Face Score:</b> {result.faceScore}</p>
          <p><b>Final Score:</b> {result.finalScore}</p>

          <h3>Skills</h3>
          <p>{result.resumeData.skills.join(", ")}</p>

          <h3>AI Resume Feedback</h3>
          <p style={{ whiteSpace: "pre-line" }}>{result.aiResume}</p>

          <h3>AI Voice Feedback</h3>
          <p style={{ whiteSpace: "pre-line" }}>{result.aiVoice}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;