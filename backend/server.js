import express from "express";
import cors from "cors";
import ingestDataRoutes from "./routes/ingestdata.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", 
}));

app.use("/api", ingestDataRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
