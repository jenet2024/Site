import mysql from "mysql2/promise";

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "https://site-65o8.vercel.app");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
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

  // --- POST : Ajouter une maintenance ---
  if (req.method === "POST") {
    const { parkingName, sensorState, technicianId } = req.body;

    if (!parkingName || !sensorState || !technicianId) {
      res.status(400).json({ success: false, message: "Champs manquants" });
      return;
    }

    try {
      await conn.execute(
        "INSERT INTO maintenance (parking_name, sensor_state, technician_id) VALUES (?, ?, ?)",
        [parkingName, sensorState, technicianId]
      );

      res.status(200).json({ success: true, message: "Maintenance enregistrée" });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'insertion",
        details: err.message,
      });
    }

    return;
  }

  // --- GET : Récupérer toutes les maintenances ---
  if (req.method === "GET") {
    try {
      const [rows] = await conn.execute(
        "SELECT * FROM maintenance ORDER BY id DESC"
      );

      res.status(200).json({ success: true, maintenances: rows });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Erreur SQL",
        details: err.message,
      });
    }

    return;
  }

  // --- Méthode non supportée ---
  res.status(405).json({ success: false, message: "Méthode non supportée" });
}
