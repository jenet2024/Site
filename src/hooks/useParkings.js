import { useEffect, useState } from "react";

export default function useParkings() {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parkings")
      .then((res) => res.json())
      .then((data) => {
        setParkings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de récupération des parkings :", err);
        setLoading(false);
      });
  }, []);

  return { parkings, loading };
}
