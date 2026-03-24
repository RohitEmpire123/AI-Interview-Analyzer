import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/authMiddleware.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), async (req, res) => {
  try {
    // Create form data for Python API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // Call Python AI service
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    res.json({
      message: "Resume analyzed successfully",
      aiResult: response.data,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "AI service failed" });
  }
});

export default router;