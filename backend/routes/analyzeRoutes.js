import express from "express";
import multer from "multer";
import { analyzeController } from "../controllers/analyzeController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/",
  protect,
  upload.fields([
    { name: "resume" },
    { name: "audio" },
    { name: "video" }
  ]),
  analyzeController
);

export default router;