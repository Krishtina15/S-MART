import React, { useState } from 'react';

export default function SellPage() {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    description: '',
    details: [], // Initialize details as an empty array
    images: null,
  });

  // Handle input changes for productName, price, and description
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const filesArray = Array.from(e.target.files);

    const isValidFiles = filesArray.every(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (isValidFiles) {
      setFormData({ ...formData, images: filesArray });
    } else {
      alert("Please upload valid image files (up to 5MB each).");
    }
  };

  // Handle adding new details
  const handleAddDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { key: "", value: "" }],
    });
  };

  // Handle changes to individual detail fields
  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index][field] = value;
    setFormData({ ...formData, details: updatedDetails });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.price || !formData.images) {
      alert("Product Name, Price, and Image are mandatory fields!");
      return;
    }

    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("details", JSON.stringify(formData.details));

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        data.append("images", file);
      });
    } else {
      alert("Please select at least one image.");
      return; // Prevent form submission if no image is selected
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Product added successfully!");
        setFormData({
          productName: "",
          price: "",
          description: "",
          details: [],
          images: null,
        });
      } else {
        const errorData = await res.json();
        alert(`Failed to add product. ${errorData.message || "Unknown error."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="max-w-3xl my-24 mx-auto p-6 bg-brown-50 shadow-md rounded-md space-y-8">
      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Product Name:</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Price:</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Images (Max 5):</label>
        <input
          type="file"
          onChange={handleImageChange}
          required
          multiple
          accept="image/*"
          className="block w-full text-sm text-brown-700 border border-brown-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brown-200 file:text-brown-800 hover:file:bg-brown-300"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-brown-800 font-semibold">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
        ></textarea>
      </div>

      <div className="space-y-2">
        <h3 className="text-brown-800 font-semibold">Details:</h3>
        {formData.details.map((detail, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Key"
              value={detail.key}
              onChange={(e) => handleDetailChange(index, "key", e.target.value)}
              className="flex-1 p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
            />
            <input
              type="text"
              placeholder="Value"
              value={detail.value}
              onChange={(e) => handleDetailChange(index, "value", e.target.value)}
              className="flex-1 p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddDetail}
          className="bg-brown-500 text-white rounded-md p-2 hover:bg-brown-600"
        >
          Add Detail
        </button>
      </div>

      <button
        type="submit"
        className="w-full p-2 text-white rounded-md bg-brown-600 hover:bg-brown-700"
      >
        Submit
      </button>
    </form>
  );
}

