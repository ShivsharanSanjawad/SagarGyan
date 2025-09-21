import express from "express";
import cors from "cors";
import ingestDWCA from "./routes/ingestdwca.js";
import elasticSearch from "./routes/elasticsearch.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", // allow your frontend
}));

app.use(express.json()); // parse JSON bodies

// API routes
app.use("/api", ingestDWCA);
app.use("/api", elasticSearch);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
