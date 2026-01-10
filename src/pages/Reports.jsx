// src/pages/Reports.jsx

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const orleansCenter = [47.9025, 1.9090];

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState("");
  const [problem, setProblem] = useState("");

  // Charger les parkings depuis /api/parkings
  useEffect(() => {
    fetch("/api/parkings")
      .then((r) => r.json())
      .then((data) => setParkings(data))
      .catch((err) => console.error("Erreur parkings:", err));
  }, []);

  const iconParking = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    iconSize: [32, 32],
  });

  // Ajouter un signalement
  const handleAddReport = async () => {
    if (!selectedParking || !problem.trim()) {
      alert("Veuillez choisir un parking et préciser le problème.");
      return;
    }

    const parking = parkings.find((p) => p.nom === selectedParking);
    if (!parking) return;

    const payload = {
      user_id: localStorage.getItem("user_id"),
      title: `Problème au parking ${parking.nom}`,
      description: problem,
      latitude: parking.lat,
      longitude: parking.lon,
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Signalement enregistré !");
        loadReports();
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (err) {
      console.error("Erreur:", err);
    }

    setSelectedParking("");
    setProblem("");
  };

  // Charger les signalements depuis /api/reports
  const loadReports = async () => {
    try {
      const user_id = localStorage.getItem("user_id");

      const res = await fetch(`/api/reports?user_id=${user_id}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const formatted = data.map((r) => ({
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

  useEffect(() => {
    loadReports();
  }, []);

  // Suppression locale (pas encore backend)
  const handleDelete = async (id) => {
    setReports(reports.filter((r) => r.id !== id));

    // Suppression dans la base
    try {
      await fetch("/api/reports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: id }),
      });
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <main className="container">
      <h1>Reports</h1>

      <section className="card">
        <h2>Signaler un problème</h2>

        <div className="flex-row">
          <select
            value={selectedParking}
            onChange={(e) => setSelectedParking(e.target.value)}
          >
            <option value="">-- Choisir un parking --</option>
            {parkings.map((p, i) => (
              <option key={i} value={p.nom}>
                {p.nom}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Préciser le problème"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />

          <button className="btn-primary" onClick={handleAddReport}>
            🚨 Signaler le problème
          </button>
        </div>
      </section>

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

                <button className="btn-danger" onClick={() => handleDelete(r.id)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Carte des signalements</h2>

        <MapContainer
          center={orleansCenter}
          zoom={14}
          style={{ height: "400px", width: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((r) => (
            <Marker key={r.id} position={r.coords} icon={iconParking}>
              <Popup>
                <strong>{r.lieu}</strong> <br />
                {r.description}
                <br />
                <button className="btn-danger" onClick={() => handleDelete(r.id)}>
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
