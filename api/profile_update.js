import mysql from "mysql2/promise";

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "https://site-65o8.vercel.app");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Méthode non autorisée" });
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
    res.status(500).json({
      success: false,
      message: "Connexion MySQL échouée",
      details: err.message,
    });
    return;
  }

  // --- Récupération des données JSON ---
  const { id, name, email } = req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "ID utilisateur manquant",
    });
    return;
  }

  try {
    await conn.execute(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );

    res.status(200).json({
      success: true,
      message: "Profil mis à jour",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur SQL",
      details: err.message,
    });
  }
}
