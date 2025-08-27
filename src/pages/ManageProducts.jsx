import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManageProducts() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", price: "", description: "" });

  // Redirect non-admin
  useEffect(() => {
    if (!currentUser?.isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product (no image)
  const handleAdd = async () => {
    if (!newProduct.name.trim() || newProduct.price === "") {
      alert("Please fill at least name and price.");
      return;
    }

    const payload = {
      name: newProduct.name.trim(),
      price: Number(newProduct.price),
      description: newProduct.description?.trim() || ""
    };

    try {
      const res = await fetch("http://localhost:5001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to add product");
      const added = await res.json();
      setProducts((prev) => [...prev, added]);
      setNewProduct({ name: "", price: "", description: "" });
    } catch (err) {
      console.error("Add product error:", err);
      alert("Failed to add product. Check console for details.");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`http://localhost:5001/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      // Update UI
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete. Check console for details.");
    }
  };

  // Start editing row
  const startEdit = (product) => {
    setEditingId(product.id);
    setEditValues({
      name: product.name || "",
      price: product.price ?? "",
      description: product.description || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", price: "", description: "" });
  };

  // Save edited fields (PATCH)
  const saveEdit = async (id) => {
    // Basic validation
    if (!editValues.name.trim() || editValues.price === "") {
      alert("Name and price are required.");
      return;
    }

    const payload = {
      name: editValues.name.trim(),
      price: Number(editValues.price),
      description: editValues.description?.trim() || ""
    };

    try {
      const res = await fetch(`http://localhost:5001/products/${id}`, {
        method: "PATCH", // patch is safer for partial updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      cancelEdit();
    } catch (err) {
      console.error("Edit/save error:", err);
      alert("Failed to save changes. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Manage Products</h2>

      {/* Add product form */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <button onClick={handleAdd}>Add Product</button>
      </div>

      {/* Product list */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Name</th>
              <th style={{ width: 120 }}>Price (EGP)</th>
              <th>Description</th>
              <th style={{ width: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isEditing = editingId === p.id;
              return (
                <tr key={p.id}>
                  <td style={{ textAlign: "center", fontWeight: "600" }}>{p.id}</td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.name}
                        onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      />
                    ) : (
                      p.name
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.price}
                        onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                      />
                    ) : (
                      p.price
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editValues.description}
                        onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                      />
                    ) : (
                      p.description || "-"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEdit(p.id)} style={{ marginRight: 8 }}>
                          Save
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(p)} style={{ marginRight: 8 }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
