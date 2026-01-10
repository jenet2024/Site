export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "https://site-65o8.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // URL de l'API Open Data
  const apiUrl =
    "https://data.orleans-metropole.fr/api/explore/v2.1/catalog/datasets/om-mobilite-parcs-stationnement/records?limit=20";

  try {
    // Récupération des données
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Transformation des données
    const parkings = data.results.map((item) => ({
      nom: item.nom,
      nb_places: item.nb_places,
      nb_places_libres: item.nb_places_disponibles,
      lat: item.geo.lat,
      lon: item.geo.lon,
    }));

    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ error: "Impossible de récupérer les données" });
  }
}
