import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Compact archive payload: only fields needed by the public interface.
router.get("/bodies", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT slug, name, body_type AS bodyType, description FROM celestial_bodies ORDER BY id"
    );
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/artifacts", async (req, res, next) => {
  try {
    const values = [];
    let where = "";
    if (req.query.body) { where = "WHERE b.slug = ?"; values.push(String(req.query.body).slice(0,80)); }
    const [rows] = await pool.query(
      `SELECT a.slug, a.name, a.artifact_type AS artifactType, a.call_sign AS callSign,
              a.status, a.location_name AS locationName, a.latitude, a.longitude,
              a.mass_kg AS massKg, a.short_story AS shortStory, a.long_story AS longStory,
              m.slug AS missionSlug, m.name AS missionName, b.slug AS bodySlug, b.name AS bodyName
       FROM artifacts a JOIN missions m ON m.id=a.mission_id
       JOIN celestial_bodies b ON b.id=a.celestial_body_id ${where}
       ORDER BY a.id`, values
    );
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(rows);
  } catch (error) { next(error); }
});

router.get("/artifacts/:slug", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.slug, a.name, a.artifact_type AS artifactType, a.call_sign AS callSign,
              a.status, a.location_name AS locationName, a.latitude, a.longitude,
              a.mass_kg AS massKg, a.short_story AS shortStory, a.long_story AS longStory,
              m.slug AS missionSlug, m.name AS missionName, b.slug AS bodySlug, b.name AS bodyName
       FROM artifacts a JOIN missions m ON m.id=a.mission_id
       JOIN celestial_bodies b ON b.id=a.celestial_body_id WHERE a.slug=? LIMIT 1`,
      [String(req.params.slug).slice(0,140)]
    );
    if (!rows.length) return res.status(404).json({ error: "Artifact not found" });
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    res.json(rows[0]);
  } catch (error) { next(error); }
});

export default router;
