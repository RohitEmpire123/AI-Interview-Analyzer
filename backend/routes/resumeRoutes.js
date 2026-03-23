import express from "express";
import upload from "../config/multer.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), (req, res) => {
  res.json({
    message: "Resume uploaded successfully",
    file: req.file,
  });
});

export default router;