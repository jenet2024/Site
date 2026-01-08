

// src/pages/AdminHome.jsx
import { useParking } from "../context/ParkingContext";

export default function AdminHome() {
  const { stats, updateStatus } = useParking();

  return (
    <main className="container">
      <h1>Accueil Admin</h1>
      <p>Nombre de places occupées : {stats.occupees}</p>
      <p>Nombre total de places : {stats.total}</p>

      <button onClick={() => updateStatus("A1", "libre")}>
        Libérer la place A1
      </button>

      <section>
        <h2>Vision globale des signalements</h2>
        {/* Ici tu peux réutiliser ton composant Reports avec tous les signalements */}
      </section>

      <section>
        <h2>Maintenance</h2>
        <p>Accès à la page maintenance</p>
      </section>
    </main>
  );
}
  