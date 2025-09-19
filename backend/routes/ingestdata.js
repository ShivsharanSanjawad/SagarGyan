import express from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import zlib from "zlib";

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handlers
function handledwca(file) {
  console.log(`DwC-A file received: ${file.originalname}`);
}

function handlenc(file) {
  console.log(`NetCDF file received: ${file.originalname}`);
}

function handlepng(file) {
  console.log(`PNG file received: ${file.originalname}`);
}

// Handle ZIP files
function handlezip(file) {
  console.log(`ZIP file received: ${file.originalname}`);
  const zip = new AdmZip(file.buffer);
  const zipEntries = zip.getEntries();

  // Check if any file inside ZIP is .nc or .dwca
  let hasNc = false;
  let hasXml = false;

  zipEntries.forEach(entry => {
    if (!entry.isDirectory) {
      const name = entry.entryName.toLowerCase();
      if (name.endsWith(".nc")) hasNc = true;
      if (name.endsWith(".xml")) hasXml = true;
    }
  });

  if (hasNc) handlenc(file);
  else if (hasXml) handledwca(file);
  else console.log(`ZIP contains other files`);
}

// Handle GZIP files
function handlegzip(file) {
  console.log(`GZIP file received: ${file.originalname}`);

  zlib.gunzip(file.buffer, (err, decompressed) => {
    if (err) {
      console.error("Error decompressing GZIP:", err);
      return;
    }

    console.log(`Decompressed GZIP size: ${decompressed.length} bytes`);
    // Simple detection: check if first few bytes contain "CDF" (common for NetCDF)
    const header = decompressed.slice(0, 3).toString();
    if (header === "CDF") {
      handlenc(file);
    } else {
      handledwca(file); // fallback if you want
    }
  });
}

// Main endpoint
router.post("/ingestdata", upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  req.files.forEach(file => {
    console.log(`Received file: ${file.originalname} | Format: ${file.mimetype}`);

    if (file.mimetype === "application/x-zip-compressed" || file.mimetype === "application/zip") {
      handlezip(file);
    } else if (file.mimetype === "application/gzip" || file.mimetype === "application/x-gzip") {
      handlegzip(file);
    } else if (file.mimetype === "image/png") {
      handlepng(file);
    } else if (file.mimetype === "text/csv") {
      console.log(`CSV file received: ${file.originalname}`);
    } else {
      console.log(`Other file type received: ${file.originalname}`);
    }
  });

  res.json({
    message: "Files received",
    files: req.files.map(f => ({ name: f.originalname, format: f.mimetype }))
  });
});

export default router;
