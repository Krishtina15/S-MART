import React, { useState } from 'react';

import axios from 'axios';


const SellPage = () => {

  const [formData, setFormData] = useState({

    productName: '',

    price: '',

    description: '',

    details: [{ key: '', value: '' }]

  });


  const [images, setImages] = useState([]);

  const [imagePreviews, setImagePreviews] = useState([]);

  const [error, setError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({

      ...prev,

      [name]: value

    }));

  };


  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    

    if (files.length + images.length > 5) {

      setError('You can upload a maximum of 5 images');

      return;

    }


    const newPreviews = files.map(file => URL.createObjectURL(file));

    

    setImages(prev => [...prev, ...files]);

    setImagePreviews(prev => [...prev, ...newPreviews]);

    setError('');

  };


  const removeImage = (indexToRemove) => {

    const updatedImages = images.filter((_, index) => index !== indexToRemove);

    const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);

    

    setImages(updatedImages);

    setImagePreviews(updatedPreviews);

  };


  const handleDetailChange = (index, field, value) => {

    const updatedDetails = [...formData.details];

    updatedDetails[index][field] = value;

    setFormData(prev => ({

      ...prev,

      details: updatedDetails

    }));

  };


  const handleAddDetail = () => {

    setFormData(prev => ({

      ...prev,

      details: [...prev.details, { key: '', value: '' }]

    }));

  };


  const removeDetail = (indexToRemove) => {

    setFormData(prev => ({

      ...prev,

      details: prev.details.filter((_, index) => index !== indexToRemove)

    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setIsSubmitting(true);

    setError('');


    const validationErrors = [];


    if (!formData.productName.trim()) {

      validationErrors.push('Product name is required');

    }


    if (!formData.price || isNaN(parseFloat(formData.price))) {

      validationErrors.push('Valid price is required');

    }


    if (images.length === 0) {

      validationErrors.push('At least one image is required');

    }


    if (validationErrors.length > 0) {

      setError(validationErrors.join(', '));

      setIsSubmitting(false);

      return;

    }


    const formDataToSubmit = new FormData();

    

    formDataToSubmit.append('name', formData.productName.trim());

    formDataToSubmit.append('price', formData.price);

    formDataToSubmit.append('description', formData.description?.trim() || '');

    

    const filteredDetails = formData.details

      .filter(detail => detail.key.trim() && detail.value.trim())

      .map(detail => ({

        key: detail.key.trim(),

        value: detail.value.trim()

      }));

    

    formDataToSubmit.append('details', JSON.stringify(filteredDetails));

    

    images.forEach((image) => {

      formDataToSubmit.append('images', image);

    });


    try {

      for (let [key, value] of formDataToSubmit.entries()) {

        console.log(`${key}:`, value);

      }


      const response = await axios.post('/api/products', formDataToSubmit, {

        headers: {

          'Content-Type': 'multipart/form-data'

        },

        timeout: 30000

      });


      if (response.data.success) {

        setFormData({

          productName: '',

          price: '',

          description: '',

          details: [{ key: '', value: '' }]

        });

        setImages([]);

        setImagePreviews([]);

        

        alert('Product created successfully!');

      } else {

        setError(response.data.message || 'Failed to create product');

      }

    } catch (err) {

      console.error('Submission Error:', err);

      

      if (err.response) {

        console.error('Server Error Response:', err.response.data);

        setError(err.response.data.message || 'Server error occurred');

      } else if (err.request) {

        console.error('No Response Error:', err.request);

        setError('No response received from server. Please check your network connection.');

      } else {

        console.error('Request Setup Error:', err.message);

        setError('Error setting up the request. Please try again.');

      }

    } finally {

      setIsSubmitting(false);

    }

  };


  return (

    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-brown-50 shadow-md rounded-md space-y-6">

      {error && (

        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">

          <span className="block sm:inline">{error}</span>

        </div>

      )}


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

          type="number"

          name="price"

          value={formData.price}

          onChange={handleChange}

          required

          step="0.01"

          className="w-full p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"

        />

      </div>


      <div className="space-y-2">

        <label className="block text-brown-800 font-semibold">Images (Max 5):</label>

        <input

          type="file"

          multiple

          onChange={handleImageChange}

          accept="image/*"

          disabled={images.length >= 5}

          className="block w-full text-sm text-brown-700 border border-brown-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brown-200 file:text-brown-800 hover:file:bg-brown-300"

        />

        

        {imagePreviews.length > 0 && (

          <div className="mt-4 grid grid-cols-5 gap-4">

            {imagePreviews.map((preview, index) => (

              <div key={index} className="relative">

                <img 

                  src={preview} 

                  alt={`Preview ${index + 1}`} 

                  className="w-full h-32 object-cover rounded-md"

                />

                <button

                  type="button"

                  onClick={() => removeImage(index)}

                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"

                >

                  &times;

                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      <div className="space-y-2">

        <label className="block text-brown-800 font-semibold">Description:</label>

        <textarea

          name="description"

          value={formData.description}

          onChange={handleChange}

          className="w-full p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"

        />

      </div>


      <div>

        <label className="block text-brown-800 font-semibold">Details:</label>

        {formData.details.map((detail, index) => (

          <div key={index} className="flex space-x-2 mb-2">

            <input

              type="text"

              placeholder="Key"

              value={detail.key}

              onChange={(e) => handleDetailChange(index, 'key', e.target.value)}

              className="flex-1 p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"

            />

            <input

              type="text"

              placeholder="Value"

              value={detail.value}

              onChange={(e) => handleDetailChange(index, 'value', e.target.value)}

              className="flex-1 p-2 border border-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"

            />

            <button

              type="button"

              onClick={() => removeDetail(index)}

              className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600"

            >

              Remove

            </button>

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

        type ="submit"

        disabled={isSubmitting}

        className={`w-full p-2 text-white rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-brown-600 hover:bg-brown-700'}`}

      >

        {isSubmitting ? 'Submitting...' : 'Create Product'}

      </button>

    </form>

  );

};


export default SellPage;