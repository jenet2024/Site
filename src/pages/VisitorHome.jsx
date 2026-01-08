// src/pages/VisitorHome.jsx
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const orleansCenter = [47.9025, 1.9090];

export default function VisitorHome() {
  const [searchId, setSearchId] = useState("");

  const handleSearch = () => {
    alert("Fonction de recherche disponible après connexion !");
  };

  return (
    <main className="container">
      <h1>Bienvenue sur le site des parkings</h1>
      <p>
        Vous pouvez consulter la carte des parkings. Pour signaler un problème ou
        réserver une place, veuillez vous connecter.
      </p>

      {/* Champ de recherche */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Entrer l'ID du parking (ex: A1)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn-primary" onClick={handleSearch}>
          Rechercher une place
        </button>
      </div>

      {/* Carte OpenStreetMap */}
      <MapContainer
        center={orleansCenter}
        zoom={14}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

      {/* Bouton connexion */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          className="btn-secondary"
          onClick={() => alert("Redirection vers la page de connexion...")}
        >
          Se connecter pour signaler un problème
        </button>
      </div>
    </main>
  );
}
