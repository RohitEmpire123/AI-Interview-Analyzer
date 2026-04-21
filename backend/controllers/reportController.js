import PDFDocument from "pdfkit";
import Report from "../models/reportModel.js";

export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.pdf"
    );

    doc.pipe(res);

    // 🔥 TITLE
    doc.fontSize(20).text("AI Interview Report", { align: "center" });

    doc.moveDown();

    // 🔥 SCORES
    doc.fontSize(14).text("Scores:", { underline: true });
    doc.moveDown(0.5);

    doc.text(`Resume Score: ${report.resumeScore}`);
    doc.text(`Voice Score: ${report.voiceScore}`);
    doc.text(`Face Score: ${report.faceScore}`);
    doc.text(`Final Score: ${report.finalScore}`);

    doc.moveDown();

    // 🔥 JOB DESCRIPTION (NEW)
    doc.text("Job Description:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(report.jobDescription || "Not Provided");

    doc.moveDown();

    // 🔥 SKILLS
    doc.fontSize(14).text("Extracted Skills:", { underline: true });
    doc.moveDown(0.5);

    if (report.resumeData?.skills?.length) {
      report.resumeData.skills.forEach(skill => {
        doc.text(`• ${skill}`);
      });
    } else {
      doc.text("No skills found");
    }

    doc.moveDown();

    // 🔥 AI RESUME FEEDBACK
    doc.fontSize(14).text("AI Resume Feedback:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(report.aiResume || "N/A");

    doc.moveDown();

    // 🔥 AI VOICE FEEDBACK
    doc.fontSize(14).text("AI Voice Feedback:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(report.aiVoice || "N/A");

    doc.end();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "PDF generation failed" });
  }
};