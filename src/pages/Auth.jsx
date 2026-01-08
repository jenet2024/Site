// src/pages/Auth.jsx

// Import des hooks React nécessaires
import { useState } from "react";
// Import du hook de navigation de React Router pour rediriger l'utilisateur
import { useNavigate } from "react-router-dom";

export default function Auth() {
  // 🔹 "mode" détermine si on est sur Connexion ou Inscription
  const [mode, setMode] = useState("login");

  // 🔹 Stockage des champs du formulaire
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    street: "",
    city: "",
    postalCode: "",
  });

  // Permet de rediriger l'utilisateur vers une autre page
  const navigate = useNavigate();

  // Fonction appelée lorsque l'utilisateur soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche la page de recharger

    // Objet envoyé au backend, contenant toutes les données du formulaire
    const payload = { ...form, mode };

    try {
      console.log("Payload envoyé:", payload);

      // Envoi des infos au backend PHP
      const res = await fetch("http://juju.rf.gd/backend/parking_app/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // conversion en JSON
        credentials: "include", // 🔹 permet d'envoyer les cookies (utile pour sessions PHP)
      });

      // Récupération de la réponse JSON
      const data = await res.json();
      console.log("Réponse backend:", data);

      // Si le backend répond "success = true"
      if (data.success) {
        // 🔹 Sauvegarde l'identifiant utilisateur dans le localStorage
        localStorage.setItem("user_id", data.user_id);

        alert(data.message);

        // 🔹 Redirection vers la page Profil
        navigate("/Profile");
      } else {
        // En cas d'erreur côté backend
        alert(data.message);
      }
    } catch (error) {
      // Si le backend ne répond pas ou erreur réseau
      console.error("Erreur lors de la requête :", error);
      alert("Impossible de contacter le serveur.");
    }
  };

  return (
    <main className="auth-container">
      <div className={`auth-card ${mode}`}>
        
        {/* 🔹 Boutons permettant de basculer entre Connexion et Inscription */}
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

          {/* 🔹 Champs uniquement affichés en mode Inscription */}
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

          {/* 🔹 Champ Email (affiché dans login + signup) */}
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

          {/* 🔹 Champ Mot de passe */}
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

          {/* 🔹 Bouton de validation (texte change selon le mode) */}
          <button type="submit" className="btn-primary">
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </button>
        </form>
      </div>
    </main>
  );
}
