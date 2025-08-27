import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(favs);
  }, []);

  const removeFavorite = (id) => {
    const updatedFavs = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  if (favorites.length === 0) return <p>No favorite products yet.</p>;

  return (
    <div className="products-container">
      {favorites.map((product) => (
        <div className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} className="product-img" />
          <h3>{product.name}</h3>
          <p>{product.price} EGP</p>
          <Link to={`/products/${product.id}`} className="details-btn">View Details</Link>
          <button className="fav-btn active" onClick={() => removeFavorite(product.id)}>
            💔 Remove Favorite
          </button>
        </div>
      ))}
    </div>
  );
}
