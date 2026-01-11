// src/pages/Home.jsx

// Import des hooks React
import { useEffect, useState } from "react";
// Import de Leaflet
import L from "leaflet";
// Import du CSS Leaflet obligatoire
import "leaflet/dist/leaflet.css";

export default function Home() {
  // Liste des parkings chargés depuis le backend
  const [parkings, setParkings] = useState([]);

  // Stockage de l'objet "map" Leaflet
  const [map, setMap] = useState(null);

  // Texte saisi dans la barre de recherche
  const [searchName, setSearchName] = useState("");

  // Parking sélectionné dans le <select> (valeur = nom du parking)
  const [selectedParkingName, setSelectedParkingName] = useState("");

  useEffect(() => {
    // --- 1) Création de la carte ---
    const m = L.map("map").setView([47.9025, 1.909], 13); // coordonnées d'Orléans
    setMap(m);

    // Ajout du fond de carte OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(m);

    // --- 2) Récupération des parkings depuis PHP ---
    fetch("https://juju.rf.gd/backend/parkings.php")
      .then((r) => r.json())
      .then((data) => {
        setParkings(data);

        // --- 3) Pour chaque parking → placer un marqueur ---
        data.forEach((p) => {
          if (!p.lat || !p.lon) return; // sécurité

          // Choix de la couleur du marker selon le taux de places disponibles
          let iconUrl;

          if (p.nb_places_libres == null) {
            iconUrl = "https://maps.google.com/mapfiles/ms/icons/grey-dot.png"; // inconnu
          } else if (p.nb_places_libres === 0) {
            iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png"; // complet
          } else {
            const taux = (p.nb_places_libres / p.nb_places) * 100;
            iconUrl =
              taux > 20
                ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png" // ok
                : "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"; // faible disponibilité
          }

          // Configuration de l'icône Leaflet
          const icon = L.icon({
            iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          // Ajout du marker sur la carte
          L.marker([p.lat, p.lon], { icon })
            .addTo(m)
            .bindPopup(`
              <b>${p.nom}</b><br>
              Places : ${p.nb_places}<br>
              Libres : ${p.nb_places_libres ?? "Indisponible"}
            `);
        });
      })
      .catch((err) => console.error("Erreur:", err));

    // Nettoyage de la carte quand le composant est retiré
    return () => {
      m.remove();
    };
  }, []);

  // Permet de garder un unique marqueur de recherche
  const [searchMarker, setSearchMarker] = useState(null);

  // --- Fonction de recherche ---
  const handleSearch = () => {
    if (!map) return;

    // 1) Si un parking a été choisi dans le select → priorité
    let found =
      selectedParkingName
        ? parkings.find((p) => p.nom === selectedParkingName)
        : null;

    // 2) Sinon, recherche par texte (match partiel)
    if (!found && searchName.trim()) {
      found = parkings.find((p) =>
        p.nom.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (found) {
      // Centrage sur le parking trouvé
      map.setView([found.lat, found.lon], 16);

      // Suppression de l’ancien marqueur si existant
      if (searchMarker) map.removeLayer(searchMarker);

      // Ajout d’un nouveau marqueur de recherche
      const marker = L.marker([found.lat, found.lon])
        .addTo(map)
        .bindPopup(`
          <b>${found.nom}</b><br>
          Places : ${found.nb_places}<br>
          Libres : ${found.nb_places_libres ?? "Indisponible"}
        `)
        .openPopup();

      setSearchMarker(marker);
    } else {
      alert("Parking non trouvé !");
    }
  };

  return (
    <main className="container">
      <h2>Parkings en direct</h2>

      {/* Conteneur qui affichera la carte Leaflet */}
      <div id="map" style={{ height: "500px", width: "100%" }}></div>

      {/* Section Recherche */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* Recherche par texte */}
        <input
          type="text"
          placeholder="Entrer le nom du parking"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        {/* Liste déroulante des parkings */}
        <select
          value={selectedParkingName}
          onChange={(e) => setSelectedParkingName(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">-- Choisir un parking --</option>

          {/* Génération des options */}
          {parkings.map((p, i) => (
            <option key={i} value={p.nom}>
              {p.nom}
            </option>
          ))}
        </select>

        {/* Bouton Rechercher */}
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔍 Rechercher
        </button>
      </div>
    </main>
  );
}
