import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Product from "../../../backend/models/product.model";
import { useAuthContext } from "../context/AuthContext.jsx";
//import { useNotifications } from "../NotificationProvider.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [offers, setOffers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [owner, setOwner]=useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [price, setPrice] = useState(null);
  const [showOfferBox, setShowOfferBox] = useState(false);
  const { authUser } = useAuthContext();
  //const { useNotifications } = useNotifications();
  const [profileImageError, setProfileImageError] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const {socket}=useSocketContext();

  // Message Component
const Message = ({ message, type }) => {
  if (!message) return null;

  const messageStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  return (
    <div className={`${messageStyles[type]} border px-4 py-3 rounded relative mb-4`} role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  )
}

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${id}`);
      if (response.data && response.data.data) {
        let productData = response.data.data;
      
        if (productData.userId) { // Check if userId exists *before* trying to populate or use it
          if (typeof productData.userId === 'string') {
            const productWithUser = await Product.findById(productData._id).populate('userId');
            productData = productWithUser;
          }
      
          setProduct(productData);
          setPrice(productData.price);
          setUserId(productData.userId._id);
          setOwner(productData.userId);
        } else {
          console.warn("Product has no userId:", productData._id); // Log a warning
          setOwner({ username: "Unknown" }); // Set a default owner or handle it differently
          setProduct(productData);
          setPrice(productData.price);
         }
       }
     }
     catch (error) {
      setError("Unexpected error occurred");
      console.error("Error fetching product:", error); // Log the full error
    } finally {
      setLoading(false);
    }
   } ;


    
  const fetchOffers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/offers/${id}`);
      setOffers(response.data.data);

    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };
  


    useEffect(() =>{
      const incrementViews = async () => {
        try {
          await axios.put(`http://localhost:8000/api/products/${id}/increment-views`);
        } catch (error) {
          console.error("Error incrementing views:", error);
        }

      };
    incrementViews(); 
    fetchProduct();
   fetchOffers();
  
     }, [id, refreshKey]);


  /*useEffect(() => {
    if (authUser) {
      // Listen for new offer notifications
      socket?.on("newOffer", (data) => {
         const { productId, buyerId, price, message } = data;

        // Notify the product owner
        io.to(productId).emit("newNotification", {
          userId: productId, // The product owner's ID
          message,
        });
      });

      // Listen for accepted offer notifications
      socket?.on("offerAccepted", (data) => {
          const { buyerId, message } = data;

        // Notify the buyer
        io.to(buyerId).emit("newNotification", {
          userId: buyerId,
          message,
        });
      });

      // Listen for rejected offer notifications
      socket?.on("offerRejected", (data) => {
        const { buyerId, message } = data;

    // Notify the buyer
    io.to(buyerId).emit("newNotification", {
      userId: buyerId,
      message,
    });
  });
}

    // Cleanup on unmount
    return () => {
      socket.off("newOffer");
      socket.off("offerAccepted");
      socket.off("offerRejected");
    };
  }, [authUser]);*/

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
  
  const handleRemoveProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8000/api/products/${id}`, {
          withCredentials: true,
        });
        setMessage("Product deleted successfully! Redirecting...");
        setMessageType("success");
        navigate("/"); // Redirect to the home page after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage("An error occurred. Please try again.");
        setMessageType("error");
      }
    }
  };

  const handleMakeOffer = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/make-offer",
        { productId: id, price },
        { withCredentials: true }
      );
      setMessage("Offer made successfully!");
      setMessageType("success");
      setRefreshKey(prevKey => prevKey + 1);
      setShowOfferBox(false);

      } catch (error) {
        console.log(error)
        setMessage("An error occurred. Please try again.");
        setMessageType("error");
    }
  };
  const handleRemoveOffer = async () => {
    if (window.confirm("Are you sure you want to remove your offer?")) {
      try {
        const offerId = await getOfferId(); // Get the offer ID
        if (!offerId) {
          alert("Offer not found");
          return;
        }
  
        await axios.delete(`http://localhost:8000/api/offers/${offerId}`, {
          withCredentials: true,
        });
        setMessage("Offer removed successfully!");
        setMessageType("success");
        
        setOffers((prevOffers) =>
          prevOffers.filter((offer) => offer._id !== offerId)
        ); // Update the offers state
        setRefreshKey(prevKey => prevKey + 1);
        setShowOfferBox(false); // Hide the offer box
      } catch (error) {
        console.error("Error removing offer:", error);
        setMessage("An error occurred. Please try again.");
        setMessageType("error");
      }
    }
  };
  const getOfferId = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/offers/find/${id}`,{ withCredentials: true });

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
    
    const offerId = await getOfferId();
    console.log(id)
    console.log(offerId)
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
      setMessage("Offer updated successfully!");
      setMessageType("success");
      
       // Update the offers state with the updated offer
       setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer._id === offerId ? { ...offer, price: response.data.data.price } : offer
        )
        
      );
      setRefreshKey(prevKey => prevKey + 1);
      setShowOfferBox(false);
    } catch (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  const ProfileImage = ({ owner }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
      <div className="relative w-10 h-10 flex-shrink-0">
        {owner?.profilePicture && !imageError ? (
          <Link to="/profile"><img
            src={`http://localhost:8000/${owner.profilePicture}`}
            alt={owner.username || "User Profile"}
            className="w-full h-full rounded-full object-cover"
            onError={() => setImageError(true)}
          
            loading="lazy"
            
          />
          </Link>
        ) : (
          <div className="w-full h-full rounded-full bg-brown-100 flex items-center justify-center">
            <span className="text-brown-600 text-lg font-semibold">
              {owner?.username ? owner.username[0].toUpperCase() : "U"}
            </span>
          </div>
        )}
      </div>
    );
  };

  const handleSellOffer = async (offerId) => {
   // console.log(offerId);
   if (product.buyerId === null){
    try {
      await axios.post(`http://localhost:8000/api/offers/accept/${offerId}`, { productId: id, offerId },{ withCredentials: true });

      

      setMessage("Accepted successfully!");
      setMessageType("success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
      console.log(error);
    }
  }
  else {
    setMessage("an offer already accepted");
      setMessageType("success");
  }
  };
  const handleAddToCart = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/carts`, {
        userId: authUser._id,productId: id
      });
      console.log("Product added to cart:", res.data);
      setMessage("product added to cart");
      setMessageType("success");
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
      console.error('Error adding to cart:', error);
    }
  };

  const handleMarkAsSold= async (productId,buyerId)=> {
     try{
      const response = await axios.post(`http://localhost:8000/api/ProductSales/sales-record`,{
        sellerId:authUser._id, buyerId,productId})
      ;
      if (response.data.success){
        console.log(" post a sellerId, buyerId and productId"
        )
        setMessage("Sale recorded successively");
        setMessageType("success");
        
        

      }else {
        console.log("Error durin postiong"
        )
        setMessage(response.data.message);
        setMessageType("error");
      } }catch (error) {

        console.error("Error marking as sold:", error);
    
        setMessage("An error occurred while recording the sale.");
    
        setMessageType("error");
    
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
      
      <Message message={message} type={messageType} />
      
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

          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg flex flex-col space-y-6">
            <div className="flex items-center space-x-4 pb-4 border-b border-brown-100">
              <ProfileImage owner={owner} />
              <div className="flex-1 min-w-0">
                {owner?.username ? (
                  <h1 className="text-xl md:text-2xl font-bold text-brown-800 truncate">
                    {owner.username}
                  </h1>
                ) : (
                  <div className="h-8 bg-brown-100 rounded-md animate-pulse w-1/2" />
                )}
              
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-brown-800 break-words">
                {product?.productName}
              </h2>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-semibold text-brown-600">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-sm text-brown-400">USD</span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4">
              {/*when an offer is accepted*/}
              {/*when an offer is accepted*/}
              {product.buyerId && userId !==0 ?(
                <>
                {/*seller view*/}
                {authUser && authUser._id === userId && (
                  <div>
                  <h2 className="text-xl font-semibold text-brown-800">Accepted Offer</h2>
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 bg-brown-100 text-brown-800">Buyer</th>
                        <th className="text-left p-3 bg-brown-100 text-brown-800">Price</th>
                        <th className="text-left p-3 bg-brown-100 text-brown-800">Status</th>
                        <th className="text-left p-3 bg-brown-100 text-brown-800">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers
                        .filter((offer) => offer.status === "accepted")
                        .map((offer) => (
                          <tr key={offer._id}>
                            <td className="p-3 text-brown-600">{offer.buyerId.username}</td>
                            <td className="p-3 text-brown-600">${offer.price}</td>
                            <td className="p-3 text-brown-600">Accepted</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleMarkAsSold(product._id,product.buyerId)}
                                className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                Mark as Sold
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                )}
              {/* Buyer view */}
            {authUser &&
              authUser._id !== userId &&
              offers.some(
                (offer) =>
                  offer.buyerId._id === authUser._id && offer.status === "accepted"
              ) && (
                <div className="space-y-4">
                  <p className="text-lg text-green-600">
                    Your offer has been accepted! Please proceed with the payment.
                  </p>
                  <button
                    onClick={() => navigate(`/payment`)}
                    className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
              </>
              ) : (
                <>
              {/*when there is no offer acepted*/}
              {/* Seller view */}
              {authUser && authUser._id === userId && (
                <div>
                  <Link
                    to={`/update-product/${product._id}`}
                    className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition text-center block mb-4"
                  >
                    Update Product
                  </Link>

                  <button
                     onClick={handleRemoveProduct}
                     className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-center block mb-4"
                  >
                     Remove Product
                  </button>

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
              ) }

              {/* Buyer view */}
              {authUser && authUser._id !== userId && (
                <>
                  {offers.some((offer) => offer.buyerId._id === authUser._id) ? (
                    // If the user has already made an offer, show "Update Offer"
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setShowOfferBox(true);
                          // Set the price to the user's existing offer when opening the box
                          const userOffer = offers.find((offer) => offer.buyerId._id === authUser._id);
                          if (userOffer) {
                            setPrice(userOffer.price);
                          }
                        }}
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
                        <button
                         onClick={handleRemoveOffer}
                         className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                        Remove Offer
                        </button>
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

                      <button
                          onClick={handleAddToCart}
                          className="w-full py-3 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition"
                        >
                          Add to Cart
                        </button>
                    </>
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