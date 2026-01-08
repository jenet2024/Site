// src/pages/Success.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  // On récupère le paramètre "type" passé lors de la redirection
  const type = new URLSearchParams(location.search).get("type");

  const message =
    type === "signup"
      ? "🎉 Bravo, compte créé avec succès !"
      : "✅ Connexion réussie !";

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>{message}</h1>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          ⬅️ Retourner à l'accueil
        </button>
      </div>
    </main>
  );
}
