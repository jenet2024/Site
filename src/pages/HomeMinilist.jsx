// src/pages/Home.jsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useParking } from "../context/ParkingContext";

const orleansCenter = [47.9025, 1.9090];

export default function HomeMinilist() {
  const { spots } = useParking();
  const [searchId, setSearchId] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);

  const handleSearch = () => {
    const spot = spots.find((s) => s.id.toLowerCase() === searchId.toLowerCase());
    if (spot) {
      setSelectedSpot({
        ...spot,
        coords: [
          orleansCenter[0] + Math.random() * 0.01 - 0.005,
          orleansCenter[1] + Math.random() * 0.01 - 0.005,
        ],
      });
    } else {
      alert("Aucune place trouvée avec cet ID.");
      setSelectedSpot(null);
    }
  };

  const iconMap = {
    libre: new L.Icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
      iconSize: [32, 32],
    }),
    occupée: new L.Icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      iconSize: [32, 32],
    }),
    indisponible: new L.Icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      iconSize: [32, 32],
    }),
  };

  return (
    <main className="container">
      <h1>Carte des parkings</h1>
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

      <MapContainer
        center={orleansCenter}
        zoom={14}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedSpot && (
          <Marker
            position={selectedSpot.coords}
            icon={iconMap[selectedSpot.status]}
          >
            <Popup>
              <strong>Place {selectedSpot.id}</strong> <br />
              Statut : {selectedSpot.status}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </main>
  );
}
