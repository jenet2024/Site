// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
        color: "white",
        padding: "30px",
        textAlign: "center",
        marginTop: "40px",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>🌐 Navigation rapide</h3>

      {/* Liens identiques à la navbar */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ color: "white", margin: "0 15px", textDecoration: "underline" }}>
          🏠 Accueil
        </Link>
        <Link to="/reports" style={{ color: "white", margin: "0 15px", textDecoration: "underline" }}>
          🚨 Signalements
        </Link>
        <Link to="/Maintenance" style={{ color: "white", margin: "0 15px", textDecoration: "underline" }}>
          🅿️ Maintenance
        </Link>
        <Link to="/Auth" style={{ color: "white", margin: "0 15px", textDecoration: "underline" }}>
          📧 Connexion
        </Link>
      </nav>

      

      {/* Copyright */}
      <p style={{ marginTop: "20px", fontSize: "0.9rem" }}>
        © 2025 Mon Application — Tous droits réservés
      </p>
    </footer>
  );
}
