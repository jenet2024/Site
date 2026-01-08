// src/pages/Maintenance.jsx
import { useParking } from "../context/ParkingContext";
import "../styles/Maintenance.css";

export default function Maintenance() {
  const { spots, toggleSensor } = useParking();

  // Détermine la classe de couleur de la carte
  const getCardColor = (sensorOk) => {
    return sensorOk ? "green" : "orange-dark"; 
    // ⚠️ "orange-dark" doit être une classe CSS définie dans Maintenance.css
    // Sinon remplacer par "darkorange"
  };

  return (
    <main className="container">
      <h2>Maintenance des capteurs</h2>
      <div className="cards-grid">
        {spots.map(({ id, nomParking, sensorOk, dateReparation, technicienId }) => {
          const color = getCardColor(sensorOk);
          return (
            <div key={id} className={`card-maintenance ${color}`}>
              {/* Affiche le nom du parking si présent, sinon l'id */}
              <h4>{nomParking || `Parking #${id}`}</h4>

              <p><strong>Capteur :</strong> {sensorOk ? "✅ OK" : "⚠️ Défaillant"}</p>

              {/* Date réparation si capteur défaillant */}
              {!sensorOk && dateReparation && (
                <p><strong>Date réparation :</strong> {dateReparation}</p>
              )}

              <p><strong>Technicien :</strong> {technicienId ? `#${technicienId}` : "N/A"}</p>

              <small className="mini-desc">
                {sensorOk
                  ? "Capteur opérationnel, aucune intervention nécessaire."
                  : "Capteur en panne, intervention prévue."}
              </small>

              <button
                className="btn-outlined"
                onClick={() => toggleSensor(id)}
              >
                🔄 Basculer l'état du capteur
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
