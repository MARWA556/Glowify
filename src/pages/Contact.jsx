import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles.css"; // make sure path matches your CSS file location

export default function Contact() {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`contact-page ${isDarkMode ? "dark" : "light"}`}>
      <h2 className="page-title">Get in Touch</h2>

      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit" className="shop-btn">Send Message</button>
      </form>
    </div>
  );
}
