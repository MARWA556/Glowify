import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cartItems.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} width={80} />
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>Price: {item.price} EGP</p>
            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
            />
          </div>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <h3>Total: {totalPrice.toFixed(2)} EGP</h3>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
