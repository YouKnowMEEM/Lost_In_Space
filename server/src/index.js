import "dotenv/config";
import express from "express";
import cors from "cors";
import archive from "./routes/archive.js";
import { pool } from "./db.js";

const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));
app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ ok: true, database: "connected" }); }
  catch { res.status(503).json({ ok: false, database: "unavailable" }); }
});
app.use("/api", archive);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Archive service error" });
});
const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Sleeping Beauties API listening on :${port}`));
