import express from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import zlib from "zlib";
import { Pool } from "pg";
import { randomUUID } from "crypto";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Main endpoint
router.post("/ingestdwca", upload.any(), (req, res) => 
{
  if (!req.files || req.files.length === 0) 
  {
    return res.status(400).json({ message: "No files uploaded" });
  }

  req.files.forEach(file => 
  {
    console.log(`Received file: ${file.originalname} | Format: ${file.mimetype}`);
  });

  res.json(
  {
    message: "Files received",
    files: req.files.map(f => ({ name: f.originalname, format: f.mimetype }))
  });
});

export default router;
