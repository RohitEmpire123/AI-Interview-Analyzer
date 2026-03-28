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

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.pdf"
    );

    doc.pipe(res);

    // 🔥 CONTENT
    doc.fontSize(20).text("AI Interview Report", { align: "center" });

    doc.moveDown();
    doc.fontSize(14).text(`Resume Score: ${report.resumeScore}`);
    doc.text(`Voice Score: ${report.voiceScore}`);
    doc.text(`Face Score: ${report.faceScore}`);
    doc.text(`Final Score: ${report.finalScore}`);

    doc.moveDown();
    doc.text("AI Resume Feedback:");
    doc.text(report.aiResume || "N/A");

    doc.moveDown();
    doc.text("AI Voice Feedback:");
    doc.text(report.aiVoice || "N/A");

    doc.end();

  } catch (error) {
    res.status(500).json({ message: "PDF generation failed" });
  }
};