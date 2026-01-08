// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="brand">SmartPark</div>

      {/* Bouton hamburger visible en mobile */}
      <button className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Liens + Auth regroupés */}
      <nav className={`navbar-links ${open ? "active" : ""}`}>
        <Link
          className={loc.pathname === "/" ? "active" : ""}
          to="/"
          onClick={closeMenu}
        >
          Accueil
        </Link>
        <Link
          className={loc.pathname === "/reports" ? "active" : ""}
          to="/reports"
          onClick={closeMenu}
        >
          Signalements
        </Link>
        <Link
          className={loc.pathname === "/maintenance" ? "active" : ""}
          to="/maintenance"
          onClick={closeMenu}
        >
          Maintenance
        </Link>
        <Link
          className={loc.pathname === "/profile" ? "active" : ""}
          to="/profile"
          onClick={closeMenu}
        >
          Profil
        </Link>

        {/* Auth intégré dans le menu */}
        {user ? (
          <div className="auth">
            <span className="welcome">Bonjour, {user.name}</span>
            <button onClick={logout} className="btn-outlined">
              Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn-primary" onClick={closeMenu}>
            Connexion
          </Link>
        )}
      </nav>
    </header>
  );
}
