import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import "../styles.css"; // ✅ Import styles

export default function Register() {
  const { registerUser, successMessage } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include a number and a special character."
      );
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/users?email=${email}`);
      const existingUsers = await res.json();

      if (existingUsers.length > 0) {
        setError("Email already registered.");
        return;
      }

      const newUser = {
        email,
        username,
        password,
        isAdmin: false,
      };

      const postRes = await fetch("http://localhost:5001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!postRes.ok) throw new Error("Failed to register");

      registerUser(newUser);
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className={`auth-container ${isDarkMode ? "dark" : "light"}`}>
      <h2 className="auth-title">Register</h2>

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
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit">Register</button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Login here
        </Link>
      </p>
    </div>
  );
}
