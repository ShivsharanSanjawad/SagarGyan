import express from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import { Pool } from "pg";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// PostgreSQL pool using .env variables
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Create an entry in the dataset table from a DwC-A ZIP
 * @param {Buffer} buffer - File contents
 * @param {string} filename - Original filename
 */
async function makeEntry(buffer, filename) {
  const datasetID = randomUUID();
  const format = "DwC-A";
  const name = filename;
  let information = null;

  try {
    const zip = new AdmZip(buffer);

    // Read eml.xml (optional)
    const emlEntry = zip.getEntry("eml.xml");
    if (emlEntry) {
      information = zip.readAsText(emlEntry);
      console.log("→ eml.xml found");
    } else {
      console.log("→ eml.xml not found");
    }

    // Read meta.xml (mandatory in DwC-A, but just log for now)
    const metaEntry = zip.getEntry("meta.xml");
    if (metaEntry) {
      console.log("→ meta.xml found");
    } else {
      console.log("→ meta.xml not found");
    }

    // Read occurrence.txt (optional, just log for now)
    const occEntry = zip.getEntry("occurrence.txt");
    if (occEntry) {
      console.log("→ occurrence.txt found");
    }

    // Insert dataset info into Postgres
    await pool.query(
      `INSERT INTO dataset (datasetID, format, name, information) 
       VALUES ($1, $2, $3, $4)`,
      [datasetID, format, name, information]
    );

    console.log(`Inserted dataset: ${datasetID}`);
    return datasetID;
  } catch (err) {
    console.error("Error processing DwC-A:", err);
    throw err;
  }
}

router.post("/ingestdwca", upload.any(), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  try {
    const results = [];

    for (const file of req.files) {
      if (file.mimetype === "application/zip" || file.originalname.endsWith(".zip")) {
        const datasetID = await makeEntry(file.buffer, file.originalname);
        results.push({ name: file.originalname, datasetID });
      } else {
        console.log(`Skipping non-zip file: ${file.originalname}`);
      }
    }

    res.json({ message: "Datasets ingested", results });
  } catch (err) {
    console.error("Error ingesting datasets:", err);
    res.status(500).json({ message: "Error ingesting datasets", error: err.message });
  }
});

export default router;
