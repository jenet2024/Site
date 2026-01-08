// Import des composants React-Leaflet pour afficher une carte
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Import du contexte Parking (qui contient la liste des places)
import { useParking } from "../context/ParkingContext";

// Coordonnées du centre d'Orléans (point de départ de la carte)
const orleansCenter = [47.9025, 1.9090];

export default function SearchParking() {
  // On récupère les places de parking depuis le contexte global
  const { spots } = useParking();

  // On génère des coordonnées artificielles pour chaque place
  // (purement pour la démonstration en attendant de vraies coordonnées)
  const spotsWithCoords = spots.map((s, i) => ({
    ...s, // on garde les propriétés existantes
    coords: [
      orleansCenter[0] + i * 0.002, // décale la latitude pour ne pas les superposer
      orleansCenter[1] + i * 0.002, // décale la longitude
    ],
  }));

  // Dictionnaire d'icônes selon le statut de la place
  // Leaflet utilise des images (png) comme marqueurs
  const iconMap = {
    libre: new L.Icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", // vert
      iconSize: [32, 32],
    }),
    occupée: new L.Icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // rouge
      iconSize: [32, 32],
    }),
    indisponible: new L.Icon({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png", // jaune
      iconSize: [32, 32],
    }),
  };

  return (
    <main className="container">
      <h1>Parkings à Orléans (OpenStreetMap)</h1>
      <p>Visualisez toutes les places avec leur statut en temps réel.</p>

      {/* Composant principal de la carte. 
          - center = coordonnées du centre
          - zoom = niveau de zoom
          - style = taille du cadre de la carte */}
      <MapContainer
        center={orleansCenter}
        zoom={14}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        {/* Couche OpenStreetMap obligatoire pour afficher les tuiles de la carte */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Génération de tous les marqueurs sur la carte */}
        {spotsWithCoords.map((spot) => (
          <Marker
            key={spot.id} // clé unique pour React
            position={spot.coords} // coordonnées calculées plus haut
            icon={iconMap[spot.status]} // icône selon statut (libre, occupée…)
          >
            {/* Fenêtre popup affichée au clic sur un marqueur */}
            <Popup>
              <strong>Place {spot.id}</strong> <br />
              Niveau {spot.level} <br />
              Statut : {spot.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Affichage sous forme de liste (vue alternative) */}
      <section className="results">
        <h2>Liste des places :</h2>
        <ul>
          {spotsWithCoords.map((s) => (
            <li key={s.id}>
              <strong>Place {s.id}</strong> — Niveau {s.level} — Statut : {s.status}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
