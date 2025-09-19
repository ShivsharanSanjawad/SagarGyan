import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/ingestdata", upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  req.files.forEach(file => {
    console.log("Received file:", file.originalname);
  });

  res.json({ message: "Files received", files: req.files.map(f => f.originalname) });
});

export default router;
