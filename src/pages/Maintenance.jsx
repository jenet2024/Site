// src/pages/Maintenance.jsx
import { useState, useEffect } from "react";
import { useParking } from "../context/ParkingContext";
import "../styles/maintenance.css";

export default function Maintenance() {
  const { spots, toggleSensor } = useParking();

  // Stocke les maintenances venant du backend
  const [maintenances, setMaintenances] = useState([]);

  // Charger les maintenances depuis l’API
  useEffect(() => {
    async function loadMaintenances() {
      try {
        const res = await fetch("/api/maintenance");
        const data = await res.json();

        if (data.success) {
          setMaintenances(data.maintenances);
        }
      } catch (err) {
        console.error("Erreur chargement maintenances :", err);
      }
    }

    loadMaintenances();
  }, []);

  // Envoyer une maintenance au backend
  async function sendMaintenance(parkingName, sensorState, technicianId) {
    try {
      await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parkingName,
          sensorState,
          technicianId,
        }),
      });
    } catch (err) {
      console.error("Erreur envoi maintenance :", err);
    }
  }

  // Détermine la couleur de la carte
  const getCardColor = (sensorOk) => {
    return sensorOk ? "green" : "orange-dark";
  };

  return (
    <main className="container">
      <h2>Maintenance des capteurs</h2>

      <div className="cards-grid">
        {spots.map(({ id, nomParking, sensorOk, dateReparation, technicienId }) => {
          const color = getCardColor(sensorOk);

          return (
            <div key={id} className={`card-maintenance ${color}`}>
              <h4>{nomParking || `Parking #${id}`}</h4>

              <p>
                <strong>Capteur :</strong>{" "}
                {sensorOk ? "✅ OK" : "⚠️ Défaillant"}
              </p>

              {!sensorOk && dateReparation && (
                <p>
                  <strong>Date réparation :</strong> {dateReparation}
                </p>
              )}

              <p>
                <strong>Technicien :</strong>{" "}
                {technicienId ? `#${technicienId}` : "N/A"}
              </p>

              <small className="mini-desc">
                {sensorOk
                  ? "Capteur opérationnel, aucune intervention nécessaire."
                  : "Capteur en panne, intervention prévue."}
              </small>

              <button
                className="btn-outlined"
                onClick={() => {
                  // 1. Basculer l’état local
                  toggleSensor(id);

                  // 2. Enregistrer la maintenance dans MySQL via l’API
                  sendMaintenance(
                    nomParking || `Parking #${id}`,
                    sensorOk ? "OK" : "DEFAILLANT",
                    technicienId || 1
                  );
                }}
              >
                🔄 Basculer l'état du capteur
              </button>
            </div>
          );
        })}
      </div>

      {/* Affichage des maintenances venant du backend */}
      <section className="maintenance-history">
        <h3>Historique des maintenances</h3>

        {maintenances.length === 0 && <p>Aucune maintenance enregistrée.</p>}

        {maintenances.map((m) => (
          <div key={m.id} className="maintenance-item">
            <strong>{m.parking_name}</strong> — {m.sensor_state}
            <br />
            Technicien : #{m.technician_id}
            <hr />
          </div>
        ))}
      </section>
    </main>
  );
}
