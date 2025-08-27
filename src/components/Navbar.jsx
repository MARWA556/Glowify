import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { currentUser, logoutUser } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo-container">
        {/* <img src="/logo.png" alt="Site Logo" className="navbar-logo" /> */}
        <Link to="/" className="navbar-site-name">
          Glowify
        </Link>
      </div>

      {/* Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
        <Link to="/products" className="navbar-link">Products</Link>

        {currentUser ? (
          <>
            <Link to="/favorites" className="navbar-link">Favorites</Link>
            <Link to="/glow-test" className="navbar-link">Glow Test</Link>
            {/* <Link to="/dashboard" className="navbar-link">Dashboard</Link> */}
            <button onClick={logoutUser} className="navbar-logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}

        {currentUser?.isAdmin && (
          <Link to="/manage" className="navbar-link">Manage</Link>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="dark-mode-toggle"
        >
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
