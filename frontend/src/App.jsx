import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [audio, setAudio] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resume || !audio) {
      alert("Upload both resume and audio");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("audio", audio);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/analyze-full",
        formData
      );

      setResult(res.data);
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

      <div className="upload-box">
        <h3>Upload Resume (PDF)</h3>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
        />
      </div>

      <div className="upload-box">
        <h3>Upload Voice (WAV)</h3>
        <input
          type="file"
          accept=".wav"
          onChange={(e) => setAudio(e.target.files[0])}
        />
      </div>

      <button onClick={handleSubmit}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="result">
          <h2>📊 Result</h2>

          <h3>Resume</h3>
          <p><b>Skills:</b> {result.resume.skills.join(", ")}</p>
          <p><b>Experience:</b> {result.resume.experience}</p>
          <p><b>Education:</b> {result.resume.education}</p>
          <p><b>Score:</b> {result.resume.score}</p>

          <h3>Voice</h3>
          <p><b>Text:</b> {result.voice.text}</p>
          <p><b>Words:</b> {result.voice.word_count}</p>
          <p><b>Speed:</b> {result.voice.speed}</p>
          <p><b>Confidence:</b> {result.voice.confidence}</p>
          <p><b>Fluency:</b> {result.voice.fluency}</p>

          <h3>Final</h3>
          <p><b>Final Score:</b> {result.final_score}</p>
          <p><b>Feedback:</b> {result.final_feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;