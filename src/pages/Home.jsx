import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useContext(ThemeContext); // Get dark mode state

  useEffect(() => {
    fetch("http://localhost:5001/products")
      .then((res) => res.json())
      .then((data) => {
        const localImages = [
          "/skin toner.jpg",
          "/moisturizer.jpg",
          "/cleanser.jpg"
        ];
        const updatedProducts = data.map((product, index) => ({
          ...product,
          image: localImages[index] || product.image
        }));

        setProducts(updatedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Header Section */}
<header
  style={{
    backgroundImage: `linear-gradient(
      rgba(0, 0, 0, ${isDarkMode ? 0.5 : 0.2}),
      rgba(0, 0, 0, ${isDarkMode ? 0.5 : 0.2})
    ), url("/header.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "4rem 2rem",
    textAlign: "left", // Align content to the left
    color: isDarkMode ? "#f5f5f5" : "#fff",
    transition: "background 0.3s ease, color 0.3s ease"
  }}
>
  <h1 style={{ marginBottom: "0.5rem" }}>Welcome to Glowify</h1>
  <p style={{ maxWidth: "500px", fontSize: "1.1rem" }}>
    Discover our carefully curated natural skin care products designed to
    enhance your natural beauty and glow.
  </p>
</header>


      {/* Products Section */}
      <section style={{ padding: "2rem" }}>
        <h2
          style={{
            color: isDarkMode ? "#f5f5f5" : "#5b4034",
            marginBottom: "1rem",
            textAlign: "center",
            transition: "color 0.3s ease"
          }}
        >
          Featured Products
        </h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading products...</p>
        ) : (
          <div style={productsGridStyle}>
            {products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  padding: "1rem",
                  textAlign: "center",
                  color: isDarkMode ? "#f5f5f5" : "#000",
                  border: `1px solid ${isDarkMode ? "#444" : "transparent"}`,
                  transition: "background 0.3s ease, color 0.3s ease, border 0.3s ease"
                }}
              >
                <div style={imageWrapperStyle}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "10px"
                    }}
                  />
                </div>
                <h3 style={{ minHeight: "3rem" }}>{product.name}</h3>
                <p>{product.price} EGP</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            to="/products"
            style={{
              backgroundColor: isDarkMode ? "#333" : "#5b4034",
              color: isDarkMode ? "#f5f5f5" : "white",
              padding: "0.8rem 1.5rem",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "1.1rem",
              transition: "background 0.3s ease, color 0.3s ease"
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}

const productsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.5rem",
  maxWidth: "900px",
  margin: "0 auto"
};

const imageWrapperStyle = {
  height: "250px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "1rem"
};
