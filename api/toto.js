











import mysql from "mysql2/promise";

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "https://site-65o8.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Connexion MySQL
  const conn = await mysql.createConnection({
    host: "sql111.infinityfree.com",
    user: "if0_40859866",
    password: "xLJoUIUXXE",
    database: "if0_40859866_SmartPark",
  });

  // Récupération user_id (envoyé par React)
  const user_id = req.body?.user_id || req.query?.user_id;

  if (!user_id) {
    res.status(401).json({ error: "Utilisateur non authentifié" });
    return;
  }

  // --- POST : ajouter un signalement ---
  if (req.method === "POST") {
    const { title, description, latitude, longitude } = req.body;

    try {
      await conn.execute(
        "INSERT INTO reports (user_id, title, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
        [user_id, title, description, latitude, longitude]
      );

      res.status(200).json({ success: true, message: "Signalement enregistré" });
    } catch (err) {
      res.status(500).json({ error: "Erreur SQL", details: err.message });
    }

    return;
  }

  // --- GET : récupérer les signalements ---
  if (req.method === "GET") {
    try {
      const [rows] = await conn.execute(
        "SELECT * FROM reports WHERE user_id = ?",
        [user_id]
      );

      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ error: "Erreur SQL", details: err.message });
    }

    return;
  }

  // --- DELETE : supprimer un signalement ---
  if (req.method === "DELETE") {
    const { report_id } = req.body;

    try {
      await conn.execute("DELETE FROM reports WHERE id = ?", [report_id]);

      res.status(200).json({ success: true, message: "Signalement supprimé" });
    } catch (err) {
      res.status(500).json({ error: "Erreur SQL", details: err.message });
    }

    return;
  }

  res.status(405).json({ error: "Méthode non autorisée" });
}
