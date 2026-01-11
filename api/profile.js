import mysql from "mysql2/promise";

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "https://site-65o8.vercel.app");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // --- Connexion MySQL ---
  let conn;
  try {
          conn = await mysql.createConnection({
          
              host: "centerbeam.proxy.rlwy.net",
              user: "root",
              password: "tGAjVyLzpNnyyfIqOsjjxOGCwkRLVzcK",
              database: "railway",
              port: 23185,
          });
  
  } catch (err) {
    res.status(500).json({ success: false, message: "Connexion MySQL échouée" });
    return;
  }

  // --- Récupération user_id ---
  const user_id = req.query.user_id;

  if (!user_id) {
    res.status(400).json({
      success: false,
      message: "ID utilisateur manquant",
    });
    return;
  }

  // --- Requête SQL ---
  try {
    const [rows] = await conn.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [user_id]
    );

    if (rows.length > 0) {
      res.status(200).json({
        success: true,
        user: rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur SQL",
      details: err.message,
    });
  }
}
