import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [editProduct, setEditProduct] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  // Create Product
  const handleCreate = async () => {
    try {
      await axios.post("/api/products", newProduct);
      setNewProduct({ name: "", price: "", image: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error.message);
    }
  };

  // Update Product
  const handleUpdate = async () => {
    try {
      await axios.put(`/api/products/${editProduct._id}`, editProduct);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error.message);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Product Management</h1>

      {/* Create Product */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Create Product</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Products</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded shadow"
            >
              {editProduct && editProduct._id === product._id ? (
                <>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                    className="border p-2 rounded w-1/3"
                  />
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: e.target.value })
                    }
                    className="border p-2 rounded w-1/3"
                  />
                  <input
                    type="text"
                    value={editProduct.image}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, image: e.target.value })
                    }
                    className="border p-2 rounded w-1/3"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="font-bold">{product.name}</h3>
                    <p>${product.price}</p>
                  </div>
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                  <button
                    onClick={() => setEditProduct(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
