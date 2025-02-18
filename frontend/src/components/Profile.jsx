import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'lucide-react';
const Profile = () => {
  const { authUser, logout } = useAuthContext();
  const [offers, setOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
 const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    username: '',
    profilePicture: '',
    email: '',
    products: [],
    orders: [],
    createdAt: '',
  });
  const [editedUser, setEditedUser] = useState({ username: '', email: '' });
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false); // Local state variable
  const [cart, setCart]=useState([]);

  useEffect(() => {
    if (!authUser?._id) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/user/${authUser._id}`, { withCredentials: true });
        console.log("Fetched user data:", res.data.data);
        setUser(res.data.data);
        setEditedUser({ username: res.data.data.username, email: res.data.data.email });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
    
  }, [authUser]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/products/user/${authUser._id}/products`); // Update with your API endpoint
            console.log("fetched user products",res.data )
            setProducts(res.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    

    fetchProducts();
}, []);
  useEffect(() => {
    const fetchCart = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/carts/user/${authUser._id}/cart`); // Update with your API endpoint
            console.log("fetched user cart",res.data )
            setCart(res.data.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };
    

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8000/api/carts/${cartId}`);
      setCart(cart.filter(item => item._id !== cartId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

const handleImageClick = (productId) => {
    navigate(`/product-details/${productId}`); // Navigate to the product details page with the ID
};

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = authUser._id;
    if(!editedUser.username || !editedUser.email){
       console.log("Username and email are required");
       return;
    }
    try {
      const res = await axios.put(`http://localhost:8000/api/user/${id}/update`,   editedUser, { withCredentials: true });
      console.log("Updated user data:", res.data);
      setUser(res.data.data);
      setEditMode(false);

     
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOffers = async () => {
    if (!authUser?._id) return;
    try {
      const res = await axios.get(`http://localhost:8000/api/offers/user/${authUser._id}`, { withCredentials: true });
      console.log("Fetched offers:", res.data.data);
      setOffers(res.data.data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  
  useEffect(() => {
    
      fetchOffers();
    
  }, [activeTab, authUser]);

  return (
    <div className="min-h-screen bg-brown-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <img 
            src={user.profilePicture 
                 ? `http://localhost:8000/${user.profilePicture.replace(/\\/g, "/")}` 
                 : "/default-avatar.png"} 
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brown-200"
          />
          <h1 className="text-3xl font-bold text-brown-900">{user.username}</h1>
          <p className="text-brown-600">{user.email}</p>
        </div>

        {/* Navigation */}
        {['profile', 'products', 'cart', 'offers', 'dashboard'].map((tab) => (
    <button
        key={tab}
        onClick={() => {
            setActiveTab(tab);
            if (tab === 'dashboard') {
                navigate('/dashboard');
            }
        }}
        className={`px-6 py-3 capitalize ${
            activeTab === tab 
                ? 'border-b-2 border-brown-700 text-brown-900' 
                : 'text-brown-500 hover:text-brown-700'
        }`}
    >
        {tab}
    </button>
          ))}
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-brown-50 p-6 rounded-lg">
            <div className="mb-6">
              <h3 className="text-brown-900 font-semibold mb-2">Member Since</h3>
              {user.createdAt ? (
                <p className="text-brown-600">{new Date(user.createdAt).toLocaleDateString()}</p>
              ) : (
                <p className="text-brown-600">Loading...</p>
              )}
            </div>
            <div className="mb-6">
              <h3 className="text-brown-900 font-semibold mb-2">Total Orders</h3>
              
              <p className="text-brown-600">{Array.isArray(offers) ? offers.length : 0}</p>
            </div>
            <button onClick={logout} className="w-full bg-brown-700 text-white py-2 rounded hover:bg-brown-800">
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div>
                {!editMode ? (
                  <button 
                    onClick={() => setEditMode(true)} 
                    className="bg-brown-700 text-white px-6 py-2 rounded hover:bg-brown-800"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <form onSubmit={handleUpdate}>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-brown-900 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedUser.username}
                          onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                          className="w-full p-3 border border-brown-200 rounded focus:ring-2 focus:ring-brown-500"
                        />
                      </div>
                      <div>
                        <label className="block text-brown-900 mb-2">Email</label>
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                          className="w-full p-3 border border-brown-200 rounded focus:ring-2 focus:ring-brown-500"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="bg-brown-700 text-white px-6 py-2 rounded hover:bg-brown-800"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            setEditedUser({ username: user.username, email: user.email });
                          }}
                          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="overflow-x-auto">
                {products.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                   {products.map((product) => (
                       <div
                           key={product._id} // Use product._id as the unique key
                           className="shadow-lg transition-transform transform hover:scale-105 bg-white rounded-lg overflow-hidden"
                       >
                           <img
                               src={`http://localhost:8000/${product.images[0]}`} // Display the first image
                               alt={product.productName}
                               className="w-full h-48 object-cover cursor-pointer"
                               onClick={() => handleImageClick(product._id)} // Pass the product ID to the handler
                           />
                           <div className="p-4">
                               <h2 className="text-lg font-semibold text-amber-900">{product.productName}</h2>
                               <p className="text-xl font-bold text-amber-800">${product.price}</p>
                           </div>
                       </div>
                   ))}
               </div>
                ) : (
                  <p className="text-brown-600">No offers found.</p>
                )}
              </div>
            )}
            
            {activeTab === 'cart' && (
            <div className="overflow-x-auto">
              {cart.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-brown-700 text-white">
                      <th className="py-3 px-6 text-left">Product</th>
                      <th className="py-3 px-6 text-left">Price</th>
                      <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-6">{item.productId.productName || "Unknown Product"}</td>
                        <td className="py-3 px-6">${item.productId.price?.toFixed(2) || "N/A"}</td>
                        <td className="py-3 px-6">
                          <button
                            onClick={() => handleRemoveFromCart(item._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-brown-600">No items in cart.</p>
              )}
            </div>
          )}
            {activeTab === 'offers' && (
              <div className="overflow-x-auto">
                {offers.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                    <thead>
                      <tr className="bg-brown-700 text-white">
                        <th className="py-3 px-6 text-left">Product</th>
                        <th className="py-3 px-6 text-left">Offer Price</th>
                        <th className="py-3 px-6 text-left">Offer Made Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers.map((offer) => (
                        <tr key={offer._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-6">{offer.productId.productName || "Unknown Product"}</td>
                          <td className="py-3 px-6">${offer.price?.toFixed(2) || "N/A"}</td>
                          <td className="py-3 px-6">{new Date(offer.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-brown-600">No offers found.</p>
                )}
              </div>
            )}
          
          </div>
        </div>
      </div>
  );
};

export default Profile;