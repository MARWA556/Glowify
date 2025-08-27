import React from "react";
import "../styles.css";

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>We believe in natural, effective skincare that celebrates your beauty.</p>
      </section>
      <section className="about-content">
        <p>
          Our journey began with a passion for creating skincare solutions using the finest natural ingredients.
          Each product is carefully formulated to nourish, protect, and rejuvenate your skin without harsh chemicals.
        </p>
        <p>
          From sourcing to packaging, we ensure sustainability and ethical practices at every step.
        </p>
      </section>
    </div>
  );
}
