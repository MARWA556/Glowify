import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, logoutUser } = useContext(AuthContext);

  // If no user logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome back, {currentUser.username}!</h1>
      <p>Email: {currentUser.email}</p>

      <div className="dashboard-links">
        <Link to="/favorites" className="dashboard-link">Your Favorites</Link>
        <Link to="/glow-test" className="dashboard-link">Your Glow Test</Link>
        <Link to="/profile" className="dashboard-link">Profile Settings</Link>
      </div>

      <button className="auth-btn" onClick={logoutUser}>Logout</button>
    </div>
  );
}
