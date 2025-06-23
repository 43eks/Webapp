// routes/djRoutes.ts
import multer from "multer";
import { Router } from "express";
import { analyzeAudio } from "../utils/audioMeta";
const upload = multer({ dest: "uploads/tmp" });

const router = Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  const { path, originalname } = req.file!;
  const meta = await analyzeAudio(path);       // length, bpm
  // S3 or local move …
  res.json({ url: savedPath, ...meta });
});
export default router;