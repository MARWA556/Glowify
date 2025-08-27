import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import "../styles.css"; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { isDarkMode } = useContext(ThemeContext);

  const localImages = [
    "/skin toner.jpg",
    "/moisturizer.jpg",
    "/cleanser.jpg",
    "/sunscreen.jpg",
    "/LipTreatment.jpg",
    "/micellar water.jpg",
    "/ClayMask.jpg"
  ];

  useEffect(() => {
    fetch("http://localhost:5001/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  const toggleFavorite = (product) => {
    let updatedFavs;
    if (favorites.some((item) => item.id === product.id)) {
      updatedFavs = favorites.filter((item) => item.id !== product.id);
    } else {
      updatedFavs = [...favorites, product];
    }
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  if (products.length === 0) {
    return <p style={{ textAlign: "center" }}>Loading products...</p>;
  }

  return (
    <div className={`products-container ${isDarkMode ? "dark" : "light"}`}>
      {products.map((product, index) => {
        const isFav = favorites.some((item) => item.id === product.id);
        return (
          <div className="product-card" key={product.id}>
            <img
              src={localImages[index] || "/default.jpg"}
              alt={product.name}
              className="product-img"
            />
            <h3>{product.name}</h3>
            <p>{product.price} EGP</p>

            <Link to={`/products/${product.id}`} className="details-btn">
              View Details
            </Link>

            <button
              className={`fav-btn ${isFav ? "active" : ""}`}
              onClick={() => toggleFavorite(product)}
            >
              {isFav ? "💔 Remove Favorite" : "❤️ Add Favorite"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
