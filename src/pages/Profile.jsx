// Importation des hooks React pour gérer l'état et les effets
import { useState, useEffect } from "react";

export default function Profile() {
  // 🔹 Données de l'utilisateur récupérées depuis le backend
  const [user, setUser] = useState(null);

  // 🔹 True/false pour activer ou désactiver le mode édition du profil
  const [editMode, setEditMode] = useState(false);

  // 🔹 Données modifiables dans le formulaire
  const [formData, setFormData] = useState({ name: "", email: "", id: "" });

  // 🔹 Récupération de l'identifiant utilisateur stocké après la connexion
  const userId = localStorage.getItem("user_id");

  // 🟦 useEffect → chargé au montage du composant
  // Il récupère les données de l'utilisateur via ton fichier PHP
  useEffect(() => {
    // Si aucun user_id dans le localStorage, on ne fait rien
    if (!userId) return;

    // Appel au backend pour obtenir les informations de l'utilisateur
    fetch(`http://juju.rf.gd/backend/parking_app/get_profile.php?user_id=${userId}`)
      .then(res => res.json()) // conversion JSON
      .then(data => {
        // Vérification si la requête s'est bien passée
        if (data.success) {
          // On stocke l'utilisateur dans l'état local
          setUser(data.user);

          // On remplit aussi le formulaire avec les données actuelles
          setFormData({
            name: data.user.name,
            email: data.user.email,
            id: data.user.id
          });
        } else {
          // Si erreur envoyée par PHP
          alert(data.message);
        }
      })
      .catch(err => console.error("Erreur chargement profil:", err)); // erreur réseau
  }, [userId]); // Déclenchement si userId change (normalement jamais)

  // 🟩 Fonction appelée lorsque l'utilisateur valide les modifications
  const handleValidate = async () => {
    try {
      // Envoi des données modifiées au backend
      const res = await fetch("http://juju.rf.gd/backend/parking_app/update_profile.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Envoi du formulaire en JSON
      });

      const data = await res.json();

      // Si la mise à jour est réussie
      if (data.success) {
        alert("Profil mis à jour !");

        // On met aussi à jour user localement
        setUser({ ...user, ...formData });

        // On quitte le mode édition
        setEditMode(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      // En cas d’erreur réseau ou autre
      console.error("Erreur mise à jour profil:", error);
      alert("Impossible de mettre à jour le profil.");
    }
  };

  return (
    <main className="container">
      <div className="card">
        <h2>Profil</h2>

        {/* Si on a bien un ID dans formData → utilisateur connecté */}
        {formData.id ? (
          <>
            {/* 🟦 Mode affichage normal */}
            {!editMode ? (
              <>
                <p><strong>Nom:</strong> {formData.name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>ID:</strong> {formData.id}</p>

                {/* Bouton pour activer le mode édition */}
                <button
                  className="btn-primary"
                  style={{ marginTop: "10px" }}
                  onClick={() => setEditMode(true)}
                >
                  Modifier mes informations
                </button>
              </>
            ) : (
              // 🟩 Mode édition du profil
              <div style={{ marginTop: "10px" }}>
                {/* Champ Nom */}
                <input
                  type="text"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                {/* Champ Email */}
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                {/* Validation du formulaire */}
                <button className="btn-success" onClick={handleValidate}>
                  Valider
                </button>
              </div>
            )}
          </>
        ) : (
          // Si l’utilisateur n’est pas connecté
          <p>Vous n'êtes pas connecté. Allez à la page Connexion.</p>
        )}
      </div>
    </main>
  );
}
