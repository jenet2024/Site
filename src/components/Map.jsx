// src/components/Map.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useParkings from "../hooks/useParkings";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const center = [47.9025, 1.9090];

export default function Map() {
  const { parkings } = useParkings();

  return (
    <MapContainer center={center} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parkings.map((p, i) => (
        <Marker
          key={i}
          position={[p.lat, p.lon]}
          icon={
            new L.Icon({
              iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              iconSize: [32, 32],
            })
          }
        >
          <Popup>
            <strong>{p.nom}</strong><br />
            {p.nb_places_libres}/{p.nb_places} libres
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
