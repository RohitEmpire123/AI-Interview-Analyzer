import express from "express";
import Report from "../models/reportModel.js";
import protect from "../middleware/authMiddleware.js";
import { jobRoles } from "../utils/jobRoles.js";
import { downloadReport } from "../controllers/reportController.js";
const router = express.Router();

router.get("/stats/progress", protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ createdAt: 1 }); // oldest → latest

    if (reports.length < 2) {
      return res.json({
        message: "Not enough data"
      });
    }

    const firstScore = reports[0].finalScore;
    const latestScore = reports[reports.length - 1].finalScore;

    const improvement =
      ((latestScore - firstScore) / firstScore) * 100;

    res.json({
      firstScore,
      latestScore,
      improvement: improvement.toFixed(2) + "%"
    });

  } catch {
    res.status(500).json({ message: "Progress error" });
  }
});
// 🔥 ANALYTICS FIRST (IMPORTANT ORDER)
router.get("/stats/summary", protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id });

    const total = reports.length;

    const avgScore =
      reports.reduce((sum, r) => sum + r.finalScore, 0) / (total || 1);

    const highPerformers = reports.filter(r => r.finalScore >= 80).length;

    res.json({
      totalReports: total,
      averageScore: avgScore.toFixed(2),
      highPerformers
    });
  } catch {
    res.status(500).json({ message: "Stats error" });
  }
});
router.get("/stats/top-skills", protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id });

    let skillCount = {};

    reports.forEach(report => {
      report.resumeData.skills.forEach(skill => {
        const key = skill.toLowerCase();
        skillCount[key] = (skillCount[key] || 0) + 1;
      });
    });

    // 🔥 sort by frequency
    const sortedSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .map(item => item[0]);

    res.json({
      topSkills: sortedSkills.slice(0, 5)
    });

  } catch {
    res.status(500).json({ message: "Top skills error" });
  }
});
router.post("/match/:id", protect, async (req, res) => {
  try {
    const { role } = req.body;

    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const userSkills = report.resumeData.skills.map(s => s.toLowerCase());
    const requiredSkills = jobRoles[role.toLowerCase()];

    if (!requiredSkills) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 🔥 Match calculation
    const matched = requiredSkills.filter(skill =>
      userSkills.includes(skill)
    );

    const missing = requiredSkills.filter(skill =>
      !userSkills.includes(skill)
    );

    const matchScore = (matched.length / requiredSkills.length) * 100;

    res.json({
      role,
      matchScore: matchScore.toFixed(2) + "%",
      matchedSkills: matched,
      missingSkills: missing
    });

  } catch {
    res.status(500).json({ message: "Match error" });
  }
});
router.get("/download/:id", protect, downloadReport);
// ✅ GET all reports + FILTER
router.get("/", protect, async (req, res) => {
  try {
    const { minScore } = req.query;

    let query = {};

    if (minScore) {
      query.finalScore = { $gte: Number(minScore) };
    }

    const reports = await Report.find({
      userId: req.user._id,
      ...query
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch {
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// ✅ GET single report
router.get("/:id", protect, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    res.json(report);
  } catch {
    res.status(500).json({ message: "Error fetching report" });
  }
});

// 🔥 DELETE report
router.delete("/:id", protect, async (req, res) => {
  try {
    await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

// 🔥 UPDATE report
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedReport = await Report.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    res.json(updatedReport);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;
