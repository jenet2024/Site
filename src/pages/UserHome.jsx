// src/pages/UserHome.jsx
import Map from "../components/Map";
import { useParking } from "../context/ParkingContext";
import ParkingSpotCard from "../components/ParkingSpotCard";

export default function UserHome() {
  const { spots, stats } = useParking();

  const percent = {
    libres: ((stats.libres / stats.total) * 100).toFixed(1),
    occupees: ((stats.occupees / stats.total) * 100).toFixed(1),
    indispo: ((stats.indispo / stats.total) * 100).toFixed(1),
  };

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-content">
          <h1>Accueil Utilisateur</h1>
          <p>Consultez l’état des places disponibles autour de vous.</p>
        </div>
        <Map />
      </section>

      <section className="stats">
        <div className="stat-card success">
          <strong>Libres:</strong> {stats.libres} ({percent.libres}%)
        </div>
        <div className="stat-card danger">
          <strong>Occupées:</strong> {stats.occupees} ({percent.occupees}%)
        </div>
        <div className="stat-card warning">
          <strong>Indispo:</strong> {stats.indispo} ({percent.indispo}%)
        </div>
      </section>

      <section className="grid">
        {spots.map((spot) => (
          <ParkingSpotCard
            key={spot.id}
            spot={spot}
            onReserve={null} // pas de réservation
            onChangeStatus={null} // pas de modification
            hideReserveButton={true}
            readOnly={true} // juste affichage
          />
        ))}
      </section>
    </main>
  );
}
