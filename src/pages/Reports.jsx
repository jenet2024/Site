// Import des hooks React
import { useEffect, useState } from "react";

// Import des composants de la librairie React-Leaflet pour la carte
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Import du style Leaflet (obligatoire pour avoir les icônes et la carte)
import "leaflet/dist/leaflet.css";

// Import direct de Leaflet pour créer une icône personnalisée
import L from "leaflet";



// Coordonnées du centre de la carte (Orléans)
const orleansCenter = [47.9025, 1.9090];

export default function Reports() {
  // Liste des signalements récupérés du backend
  const [reports, setReports] = useState([]);

  // Liste des parkings (pour choisir un parking à signaler)
  const [parkings, setParkings] = useState([]);

  // Nom du parking sélectionné par l'utilisateur
  const [selectedParking, setSelectedParking] = useState("");

  // Problème écrit par l'utilisateur dans l'input
  const [problem, setProblem] = useState("");


  // 📌 Charger les parkings depuis parkings.php au chargement du composant
  useEffect(() => {
    fetch("http://localhost/backend/parkings.php")
      .then((r) => r.json())
      .then((data) => setParkings(data)) // On stocke les parkings en état
      .catch((err) => console.error("Erreur:", err));
  }, []);


  // Icône Leaflet personnalisée pour les signalements
  const iconParking = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    iconSize: [32, 32],
  });


  // 📌 Fonction pour ajouter un signalement
  const handleAddReport = async () => {
    // Vérification : un parking choisi + un texte
    if (!selectedParking || !problem.trim()) {
      alert("Veuillez choisir un parking et préciser le problème.");
      return;
    }

    // Trouver les coordonnées du parking sélectionné
    const parking = parkings.find((p) => p.nom === selectedParking);
    if (!parking) return;

    // Objet envoyé au backend
    const payload = {
      title: `Problème au parking ${parking.nom}`,
      description: problem,
      latitude: parking.lat,
      longitude: parking.lon,
    };

    try {
      // POST vers reports_api.php
      const res = await fetch("http://localhost/backend/parking_app/reports_api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // pour cookies/session PHP
      });

      const data = await res.json();

      if (data.success) {
        alert("Signalement enregistré !");
        await loadReports(); // recharge les signalements depuis la base
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (err) {
      console.error("Erreur:", err);
    }

    // On vide le formulaire après envoi
    setSelectedParking("");
    setProblem("");
  };


  // 📌 Fonction pour charger tous les signalements depuis le backend
  const loadReports = async () => {
    try {
      const res = await fetch("http://localhost/backend/parking_app/reports_api.php", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        // Adapter les données pour l'affichage dans React-Leaflet
        const formatted = data.reports.map((r) => ({
          id: r.id,
          lieu: r.title,
          description: r.description,
          coords: [r.latitude, r.longitude],
        }));

        setReports(formatted);
      }
    } catch (err) {
      console.error("Erreur chargement reports:", err);
    }
  };


  // Charger les signalements au premier affichage
  useEffect(() => {
    loadReports();
  }, []);


  // 📌 Suppression d'un signalement côté frontend (pas backend)
  const handleDelete = (id) => {
    // Supprime dans le state React ↓
    setReports(reports.filter((r) => r.id !== id));

    // ⚠️ NOTE :
    // Cela ne supprime PAS dans la base de données !
    // Il faut ajouter un DELETE dans reports_api.php pour une suppression complète.
  };


  return (
    <main className="container">
      <h1>Reports</h1>

      {/* 📌 Formulaire de signalement */}
      <section className="card">
        <h2>Signaler un problème</h2>

        <div className="flex-row">

          {/* Choix du parking */}
          <select
            value={selectedParking}
            onChange={(e) => setSelectedParking(e.target.value)}
          >
            <option value="">-- Choisir un parking --</option>

            {/* Affichage des parkings dans la liste */}
            {parkings.map((p, i) => (
              <option key={i} value={p.nom}>
                {p.nom}
              </option>
            ))}
          </select>

          {/* Texte du problème */}
          <input
            type="text"
            placeholder="Préciser le problème (ex: Parking indisponible)"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />

          {/* Bouton pour envoyer le signalement */}
          <button className="btn-primary" onClick={handleAddReport}>
            🚨 Signaler le problème
          </button>
        </div>
      </section>

      {/* 📌 Liste des signalements de l'utilisateur */}
      <section className="card">
        <h2>Mes signalements</h2>

        {reports.length === 0 ? (
          <p>Aucun signalement pour l'instant.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reports.map((r) => (
              <li
                key={r.id}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  <strong>{r.lieu}</strong> — {r.description}
                </span>

                {/* Bouton de suppression locale */}
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(r.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 📌 Carte OpenStreetMap affichant les signalements */}
      <section>
        <h2>Carte des signalements</h2>

        <MapContainer
          center={orleansCenter}
          zoom={14}
          style={{ height: "400px", width: "100%", borderRadius: "12px" }}
        >
          {/* Couche OpenStreetMap */}
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Affichage des markers pour chaque signalement */}
          {reports.map((r) => (
            <Marker key={r.id} position={r.coords} icon={iconParking}>
              <Popup>
                <strong>{r.lieu}</strong> <br />
                {r.description}
                <br />

                {/* Bouton de suppression depuis la popup */}
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(r.id)}
                >
                  Supprimer
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>
    </main>
  );
}
