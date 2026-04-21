import { useState, useEffect } from "react";
import API from "../services/api";

import FileUpload from "../components/FileUpload";
import ScoreCard from "../components/ScoreCard";
import SkillsList from "../components/SkillsList";
import FeedbackBox from "../components/FeedbackBox";
import ScoreChart from "../components/ScoreChart";
import VideoRecorder from "../components/VideoRecorder";
import ReportList from "../components/ReportList";
import AnalyticsCards from "../components/AnalyticsCards";

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState(null);
  const [topSkills, setTopSkills] = useState([]);

  // 🔄 Fetch all data
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get("/api/report");
      setReports(res.data);

      const summaryRes = await API.get("/api/report/stats/summary");
      setSummary(summaryRes.data);

      const progressRes = await API.get("/api/report/stats/progress");
      setProgress(progressRes.data);

      const skillsRes = await API.get("/api/report/stats/top-skills");
      setTopSkills(skillsRes.data.topSkills || []);

    } catch (err) {
      console.log(err);
    }
  };

  // 🚀 Submit
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("audio", audio);
      formData.append("video", video);

      const res = await API.post("/api/analyze", formData);

      setResult(res.data.report);

      // 🔥 refresh dashboard data
      fetchReports();

    } catch (err) {
      alert("Error analyzing");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/report/${id}`);
      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  // 📄 Download
  const handleDownload = (id) => {
    window.open(`http://localhost:5000/api/report/download/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        AI Interview Analyzer
      </h1>

      {/* 🎥 Recorder */}
      <VideoRecorder
        setVideoFile={setVideo}
        setAudioFile={setAudio}
      />

      {/* 📄 Resume Upload */}
<div className="mb-6">
  <div className="max-w-xl mx-auto bg-gray-900 shadow-md rounded-2xl p-6 border border-gray-200">
    
    <h2 className="text-lg font-semibold text-gray-200 mb-3">
      Upload Resume
    </h2>

    <p className="text-sm text-gray-500 mb-4">
      Upload your resume in PDF format to analyze your skills.
    </p>

    <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:border-blue-500 transition">
      <FileUpload
        label=""
        accept=".pdf"
        onChange={setResume}
      />
      <p className="text-xs text-gray-400 mt-2">
        Only PDF files are supported
      </p>
    </div>

  </div>
</div>

      {/* 🚀 Analyze Button */}
      <button
        onClick={handleSubmit}
        disabled={!resume || !audio || !video}
        className="bg-blue-500 mx-auto px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* 📊 Analytics ALWAYS visible */}
      {summary && (
        <div className="mt-8">
          <AnalyticsCards summary={summary} progress={progress} />
        </div>
      )}

      {/* 🔝 Top Skills */}
      {topSkills.length > 0 && (
        <div className="mt-6">
          <SkillsList skills={topSkills} />
        </div>
      )}

      {/* 📈 History Chart */}
      {reports.length > 0 && (
        <div className="mt-6">
          <ScoreChart reports={reports} />
        </div>
      )}

      {/* 📊 Latest Result */}
      {result && (
        <div className="mt-8 space-y-6">

          {/* Scores */}
          <div className="grid md:grid-cols-4 gap-4">
            <ScoreCard title="Resume" score={result.resumeScore} />
            <ScoreCard title="Voice" score={result.voiceScore} />
            <ScoreCard title="Face" score={result.faceScore} />
            <ScoreCard title="Final" score={result.finalScore} />
          </div>

          {/* Skills */}
          <SkillsList skills={result.resumeData?.skills} />

          {/* Feedback */}
          <div className="grid md:grid-cols-2 gap-4">
            <FeedbackBox
              title="Resume Feedback"
              text={result.aiResume}
            />
            <FeedbackBox
              title="Voice Feedback"
              text={result.aiVoice}
            />
          </div>

        </div>
      )}

      {/* 📋 Reports List */}
      {reports.length > 0 && (
        <div className="mt-8">
          <ReportList
            reports={reports}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        </div>
      )}

    </div>
  );
}