import mysql from "mysql2/promise";

export default async function handler(req, res) {
  try {
    // --- CORS ---
    res.setHeader("Access-Control-Allow-Origin", "https://site-65o8.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // --- Connexion MySQL ---
    const conn = await mysql.createConnection({
      host: "centerbeam.proxy.rlwy.net",
      user: "root",
      password: "tGAjVyLzpNnyyfIqOsjjxOGCwkRLVzcK",
      database: "railway",
      port: 23185,
    });

    // --- Récupération user_id ---
    const user_id = req.body?.user_id || req.query?.user_id;

    if (!user_id) {
      res.status(401).json({ success: false, error: "Utilisateur non authentifié" });
      return;
    }

    // --- POST : ajouter un signalement ---
    if (req.method === "POST") {
      const { title, description, latitude, longitude } = req.body;

      if (!title || !description || !latitude || !longitude) {
        res.status(400).json({ success: false, error: "Champs requis manquants" });
        return;
      }

      await conn.execute(
        "INSERT INTO reports (user_id, title, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
        [user_id, title, description, latitude, longitude]
      );

      res.status(200).json({ success: true, message: "Signalement enregistré" });
      return;
    }

    // --- GET : récupérer les signalements ---
    if (req.method === "GET") {
      const [rows] = await conn.execute(
        "SELECT * FROM reports WHERE user_id = ? ORDER BY id DESC",
        [user_id]
      );

      res.status(200).json({ success: true, reports: rows });
      return;
    }

    // --- DELETE : supprimer un signalement ---
    if (req.method === "DELETE") {
      const { report_id } = req.body;

      if (!report_id) {
        res.status(400).json({ success: false, error: "ID du signalement requis" });
        return;
      }

      await conn.execute("DELETE FROM reports WHERE id = ?", [report_id]);

      res.status(200).json({ success: true, message: "Signalement supprimé" });
      return;
    }

    // --- Méthode non supportée ---
    res.status(405).json({ success: false, error: "Méthode non autorisée" });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
      details: err.message,
    });
  }
}
