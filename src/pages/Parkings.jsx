// Import du hook personnalisé permettant de récupérer les parkings
import useParkings from "../hooks/useParkings";

export default function Parkings() {
  // On récupère :
  //  - parkings : la liste des parkings chargés depuis le backend
  //  - loading  : un booléen qui indique si les données sont encore en cours de chargement
  const { parkings, loading } = useParkings();

  // Si les données ne sont pas encore chargées, on affiche un message temporaire
  if (loading) return <p>Chargement des données...</p>;

  // Si loading = false, on affiche la liste
  return (
    <main className="container">
      {/* Titre de la page */}
      <h1>Liste des parkings</h1>

      {/* Liste HTML contenant tous les parkings */}
      <ul>
        {parkings.map((p, i) => (
          // Chaque parking est affiché dans un <li>
          // "key={i}" est utilisé pour éviter un warning React
          <li key={i}>
            {/* Affichage du nom du parking */}
            <strong>{p.nom}</strong> — {p.nb_places_libres}/{p.nb_places} libres
            <br />

            {/* Coordonnées GPS du parking */}
            Position : {p.lat}, {p.lon}
          </li>
        ))}
      </ul>
    </main>
  );
}
