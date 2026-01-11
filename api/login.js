import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
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

    // --- Vérification du JSON ---
    if (req.headers["content-type"] !== "application/json") {
      res.status(400).json({ success: false, message: "Format JSON requis" });
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

    // --- Récupération JSON ---
    const { email, password, mode, name, street, city, postalCode } = req.body;

    if (!email || !password || !mode) {
      res.status(400).json({
        success: false,
        message: "Champs requis manquants",
      });
      return;
    }

    // ---------------------------------------------------------
    // 🔹 INSCRIPTION (SIGNUP)
    // ---------------------------------------------------------
    if (mode === "signup") {
      const [existing] = await conn.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existing.length > 0) {
        res.status(400).json({
          success: false,
          message: "Email déjà utilisé",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await conn.execute(
        "INSERT INTO users (name, street, city, postalCode, email, password) VALUES (?, ?, ?, ?, ?, ?)",
        [name, street, city, postalCode, email, hashedPassword]
      );

      res.status(200).json({
        success: true,
        message: "Compte créé avec succès",
        user_id: result.insertId,
      });
      return;
    }

    // ---------------------------------------------------------
    // 🔹 CONNEXION (LOGIN)
    // ---------------------------------------------------------
    if (mode === "login") {
      const [rows] = await conn.execute(
        "SELECT id, password FROM users WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "Utilisateur introuvable",
        });
        return;
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        res.status(401).json({
          success: false,
          message: "Mot de passe incorrect",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Connexion réussie",
        user_id: user.id,
      });
      return;
    }

    // ---------------------------------------------------------
    // 🔹 Mode invalide
    // ---------------------------------------------------------
    res.status(400).json({
      success: false,
      message: "Mode invalide",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      details: err.message,
    });
  }
}
