import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../context/AuthContext";

export default function SellPage() {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    details: [],
    images: null,
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  if (!authUser) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const isValidFiles = filesArray.every(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    
    if (isValidFiles) {
      setFormData({ ...formData, images: filesArray });
    } else {
      setMessage("Please upload valid image files (up to 5MB each).");
      setMessageType("error");
    }
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { key: "", value: "" }],
    });
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index][field] = value;
    setFormData({ ...formData, details: updatedDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.price || !formData.images) {
      setMessage("Product Name, Price, and Image are mandatory fields!");
      setMessageType("error");
      return;
    }

    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("details", JSON.stringify(formData.details));
    data.append("userId", authUser._id);
    formData.images.forEach((file) => data.append("images", file));

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      const responseData = await res.json();

      if (res.ok) {
        setMessage("Product added successfully!");
        setMessageType("success");
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(responseData.message || "Failed to add product.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl my-24 mx-auto p-6 bg-brown-50 shadow-md rounded-md space-y-8">
      {message && (
        <div className={`p-3 text-sm text-center rounded-md ${messageType === "success" ? "bg-green-100 text-green-700 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"}`}>
          {message}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Product Name:</label>
        <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="w-full p-2 border border-brown-300 rounded-md" />
      </div>

      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Price:</label>
        <input type="text" name="price" value={formData.price} onChange={handleChange} required className="w-full p-2 border border-brown-300 rounded-md" />
      </div>

      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Images (Max 5):</label>
        <input type="file" onChange={handleImageChange} required multiple accept="image/*" className="w-full p-2 border border-brown-300 rounded-md" />
      </div>

      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-brown-300 rounded-md"></textarea>
      </div>

      <div className="space-y-2">
        <h3 className="text-brown-800 font-semibold">Details:</h3>
        {formData.details.map((detail, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input type="text" placeholder="Key" value={detail.key} onChange={(e) => handleDetailChange(index, "key", e.target.value)} className="flex-1 p-2 border border-brown-300 rounded-md" />
            <input type="text" placeholder="Value" value={detail.value} onChange={(e) => handleDetailChange(index, "value", e.target.value)} className="flex-1 p-2 border border-brown-300 rounded-md" />
          </div>
        ))}
        <button type="button" onClick={handleAddDetail} className="bg-brown-500 text-white rounded-md p-2 hover:bg-brown-600">Add Detail</button>
      </div>

      <button type="submit" className="w-full p-2 text-white rounded-md bg-brown-600 hover:bg-brown-700">Submit</button>
    </form>
  );
}
