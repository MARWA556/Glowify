import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import "../styles.css"; 

export default function Login() {
  const { loginUser, successMessage } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        setError("User not found.");
        return;
      }

      const user = users[0];
      if (user.password !== password) {
        setError("Incorrect password.");
        return;
      }

      loginUser(user);
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className={`auth-container ${isDarkMode ? "dark" : "light"}`}>
      <h2 className="auth-title">Login</h2>

      {error && <p className="auth-error">{error}</p>}
      {successMessage && <p className="auth-success">{successMessage}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>

      <p className="auth-footer-text">
        Don't have an account?{" "}
        <Link to="/register" className="auth-link">
          Register here
        </Link>
      </p>
    </div>
  );
}
