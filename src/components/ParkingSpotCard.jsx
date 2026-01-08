// src/components/ParkingSpotCard.jsx
import StatusBadge from "./StatusBadge";

export default function ParkingSpotCard({
  spot,
  onReserve,
  onChangeStatus,
  hideReserveButton = false,
  readOnly = false,
}) {
  return (
    <div className="spot-card">
      <div className="spot-header">
        <h4>{spot.id}</h4>
        <StatusBadge status={spot.status} />
      </div>
      <p><strong>Niveau:</strong> {spot.level}</p>
      <p><strong>Capteur:</strong> {spot.sensorOk ? "OK" : "Défaillant"}</p>

      {!readOnly && (
        <div className="spot-actions">
          {/* {!hideReserveButton && (
            <button
              className="btn-primary"
              disabled={spot.status !== "libre"}
              onClick={() => onReserve?.(spot)}
            >
              Réserver
            </button>
          )} */}
          {onChangeStatus && (
            <select
              className="select"
              value={spot.status}
              onChange={(e) => onChangeStatus(spot.id, e.target.value)}
            >
              <option value="libre">Libre</option>
              <option value="occupée">Occupée</option>
              <option value="indisponible">Indisponible</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
}
