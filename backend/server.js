import express from "express";
import cors from "cors";
import ingestDWCA from "./routes/ingestdwca.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", 
}));

app.use("/api", ingestDWCA);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
