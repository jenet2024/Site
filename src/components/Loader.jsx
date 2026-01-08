// src/components/Loader.jsx
export default function Loader({ label = "Chargement..." }) {
  return (
    <div className="loader">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
