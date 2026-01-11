export default async function handler(req, res) {
  try {
    // --- CORS ---
    res.setHeader("Access-Control-Allow-Origin", "https://site-65o8.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    if (req.method !== "GET") {
      res.status(405).json({ success: false, error: "Méthode non autorisée" });
      return;
    }

    // URL de l'API Open Data
    const apiUrl =
      "https://data.orleans-metropole.fr/api/explore/v2.1/catalog/datasets/om-mobilite-parcs-stationnement/records?limit=20";

    // Récupération des données
    const response = await fetch(apiUrl);

    if (!response.ok) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de l'appel à l'API OpenData",
      });
      return;
    }

    const data = await response.json();

    if (!data.results) {
      res.status(500).json({
        success: false,
        error: "Format inattendu de l'API OpenData",
      });
      return;
    }

    // Transformation des données
    const parkings = data.results.map((item) => ({
      nom: item.nom,
      nb_places: item.nb_places,
      nb_places_libres: item.nb_places_disponibles,
      lat: item.geo?.lat,
      lon: item.geo?.lon,
    }));

    res.status(200).json({ success: true, parkings });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
      details: error.message,
    });
  }
}
