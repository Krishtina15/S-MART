import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [price, setPrice] = useState(null);
  const [showOfferBox, setShowOfferBox] = useState(false);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
          setPrice(response.data.data.price);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        setError("Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/offers/${id}`);
        setOffers(response.data.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchProduct();
    fetchOffers();
  }, [id]);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handlePriceChange = (change) => {
    setPrice((prevPrice) => Math.max(prevPrice + change, product.price));
  };

  const handleMakeOffer = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/make-offer",
        { productId: id, price },
        { withCredentials: true }
      );
      alert("Offer made successfully!");
      setShowOfferBox(false);

      // Add the new offer to the offers state
      setOffers((prevOffers) => [...prevOffers, response.data.data]);
    } catch (error) {
      alert("Error making offer");
    }
  };

  const getOfferId = async (productId, buyerId) => {
    try {
        const response = await axios.get("http://localhost:8000/api/offers/find", {
            params: { productId, buyerId },
        });

        console.log("Offer Response:", response.data); // Debugging

        if (response.data.success) {
            return response.data.offerId; // Extract the offerId
        } else {
            console.log("Offer not founds");
            return null;
        }
    } catch (error) {
        console.error("Error fetching offer:", error);
        return null;
    }
};

  const handleEditOffer = async () => {
    
    const offerId = await getOfferId(id, authUser._id);
    if (!offerId) {
        alert("Offer not founds");
        return;
      }
    
    try {
      const response = await axios.put(
        `http://localhost:8000/api/offers/edit/${offerId}`,
        { price},
        { withCredentials: true }
      );
      alert("Offer updated successfully!");
      
       // Update the offers state with the updated offer
       setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer._id === offerId ? { ...offer, price: response.data.data.price } : offer
        )
      );
      
    } catch (error) {
      console.log(error);
      alert("Error updating offer");
    }
  };

  const handleSellOffer = async (offerId) => {
    try {
      await axios.post(`http://localhost:8000/api/offers/accept/${id}`, { productId: id, offerId });
      alert("Accepted successfully!");
    } catch (error) {
      alert("Error selling product");
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-brown-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-600">{error}</p>;
  }

  if (!product) {
    return <p className="text-center text-lg text-brown-600">Product not found</p>;
  }

  return (
    <main className="p-8 bg-brown-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Grid layout for image and details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Image Slider */}
          <div className="relative rounded-lg overflow-hidden shadow-xl flex items-center">
            <img
              className="w-full h-auto max-h-[500px] object-cover transition-transform duration-300 hover:scale-105"
              src={`http://localhost:8000/${product.images[currentImageIndex]}`}
              alt={`${product.productName} - Image ${currentImageIndex + 1}`}
            />

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white bg-brown-800/60 p-3 rounded-full hover:bg-brown-900/70 transition"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white bg-brown-800/60 p-3 rounded-full hover:bg-brown-900/70 transition"
            >
              &gt;
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-brown-800/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          </div>

          {/* Price and Actions */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col space-y-6">
            <h1 className="text-3xl font-bold text-brown-800">{product.productName}</h1>
            <div className="text-2xl font-semibold text-brown-600">${product.price}</div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              {/* Seller view */}
              {authUser && authUser._id === product.userId && (
                <div>
                  <Link
                    to={`/update-product/${product._id}`}
                    className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition text-center block mb-4"
                  >
                    Update Product
                  </Link>

                  <h2 className="text-xl font-semibold text-brown-800">Offers</h2>
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 bg-brown-100 text-brown-800">Buyer</th>
                        <th className="text-left p-3 bg-brown-100 text-brown-800">Price</th>
                        <th className="text-left p-3 bg-brown-100 text-brown-800">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers.map((offer) => (
                        <tr key={offer._id}>
                          <td className="p-3 text-brown-600">{offer.buyerId.username}</td>
                          <td className="p-3 text-brown-600">${offer.price}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleSellOffer(offer._id)}
                              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              Accept Offer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Buyer view */}
              {authUser && authUser._id !== product.userId && (
                <>
                  {offers.some((offer) => offer.buyerId._id === authUser._id) ? (
                    // If the user has already made an offer, show "Update Offer"
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowOfferBox(true)}
                        className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                      >
                        Update Offer
                      </button>
                      {showOfferBox && (
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            onClick={() => handlePriceChange(-5)}
                            className="py-2 px-4 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-24 py-2 px-4 border border-brown-600 rounded-lg text-center text-brown-800"
                          />
                          <button
                            onClick={() => handlePriceChange(5)}
                            className="py-2 px-4 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                          >
                            +
                          </button>
                        </div>
                      )}
                      {showOfferBox && (
                        <button
                          onClick={handleEditOffer}
                          className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                        >
                          Confirm Update
                        </button>
                      )}
                    </div>
                  ) : (
                    // If the user hasn't made an offer, show "Make Offer"
                    <>
                      {showOfferBox ? (
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            onClick={() => handlePriceChange(-5)}
                            className="py-2 px-4 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-24 py-2 px-4 border border-brown-600 rounded-lg text-center text-brown-800"
                          />
                          <button
                            onClick={() => handlePriceChange(5)}
                            className="py-2 px-4 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowOfferBox(true)}
                          className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                        >
                          Make Offer
                        </button>
                      )}
                      {showOfferBox && (
                        <button
                          onClick={handleMakeOffer}
                          className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                        >
                          Confirm Offer
                        </button>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-brown-800 mb-6">Product Details</h2>

          {/* Product Details Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-3 bg-brown-100 text-brown-800">Key</th>
                  <th className="text-left p-3 bg-brown-100 text-brown-800">Value</th>
                </tr>
              </thead>
              <tbody>
                {product.details.map((detail, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 text-brown-600">{detail.key}</td>
                    <td className="p-3 text-brown-600">{detail.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Product Description */}
          <div className="text-brown-600">
            <h3 className="text-xl font-semibold mb-4 text-brown-800">Description</h3>
            <p className="text-base leading-relaxed">{product.description}</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;