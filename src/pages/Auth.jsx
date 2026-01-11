// src/pages/Auth.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...form, mode };

    try {
      console.log("Payload envoyé:", payload);

      // 🔹 Envoi vers ton backend Node.js sur Vercel
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Réponse backend:", data);

      if (data.success) {
        // 🔹 Sauvegarde l'identifiant utilisateur
        localStorage.setItem("user_id", data.user_id);

        alert(data.message);

        // 🔹 Redirection vers la page Profil
        navigate("/Profile");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Impossible de contacter le serveur.");
    }
  };

  return (
    <main className="auth-container">
      <div className={`auth-card ${mode}`}>
        
        {/* 🔹 Onglets Connexion / Inscription */}
        <div className="tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Connexion
          </button>

          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="auth-form">

          {/* 🔹 Champs visibles uniquement en mode Inscription */}
          {mode === "signup" && (
            <>
              <div className="field">
                <label>Nom</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Adresse</label>
                <input
                  type="text"
                  placeholder="Numéro et rue"
                  value={form.street}
                  onChange={(e) =>
                    setForm({ ...form, street: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Ville</label>
                <input
                  type="text"
                  placeholder="Orléans"
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                  required
                />
              </div>

              <div className="field">
                <label>Code postal</label>
                <input
                  type="text"
                  placeholder="45000"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  required
                />
              </div>
            </>
          )}

          {/* 🔹 Email */}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="exemple@mail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* 🔹 Mot de passe */}
          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {/* 🔹 Bouton */}
          <button type="submit" className="btn-primary">
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </button>
        </form>
      </div>
    </main>
  );
}
