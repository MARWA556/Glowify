
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Don’t force numeric ID — allow strings too
    fetch(`http://localhost:5001/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  const toggleFavorite = () => {
    if (!product) return;
    let updatedFavs;
    if (favorites.some((item) => item.id === product.id)) {
      updatedFavs = favorites.filter((item) => item.id !== product.id);
    } else {
      updatedFavs = [...favorites, product];
    }
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center" }}>{error}</p>;

  return (
    <div className="single-product-page" style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
      <img
        src={product.image || "https://via.placeholder.com/400x300?text=No+Image"}
        alt={product.name}
        className="product-image"
        style={{ width: "100%", borderRadius: 10, marginBottom: "1rem" }}
      />
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price" style={{ fontWeight: "bold", marginBottom: "1rem" }}>
          {product.price} EGP
        </p>
        <p>{product.description || "This is a high-quality product designed to enhance your skincare routine."}</p>
        <button
          onClick={toggleFavorite}
          style={{
            cursor: "pointer",
            backgroundColor: favorites.some((item) => item.id === product.id) ? "#ff6b6b" : "#eee",
            color: favorites.some((item) => item.id === product.id) ? "white" : "#333",
            border: "none",
            padding: "0.7rem 1.2rem",
            borderRadius: "5px",
            marginTop: "1rem",
            fontSize: "1rem",
          }}
        >
          {favorites.some((item) => item.id === product.id) ? "💔 Remove Favorite" : "❤️ Add Favorite"}
        </button>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            marginTop: "2rem",
            textDecoration: "none",
            color: "#5b4034",
            fontWeight: "600",
          }}
        >
          ⬅ Back to Products
        </Link>
      </div>
    </div>
  );
}
