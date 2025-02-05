import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from "../context/AuthContext";
const Profile = () => {
  const { authUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    username: '',
    profilePicture: '',
    email: '',
    products: [],
    orders: [],
    createdAt: '',
  });

  useEffect(() => {
    if (!authUser?._id) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/user/${authUser._id}`,{ withCredentials: true });
        console.log("Fetched user data:", res.data.data);
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [authUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const id = authUser._id;
    try {
      const res = await axios.put(`http://localhost:8000/api/user/${id}`, {user},{ withCredentials: true });
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

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
        <div className="flex justify-center mb-8 border-b border-brown-100">
          {['profile', 'orders', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
              <p className="text-brown-600">{Array.isArray(user.orders) ? user.orders.length : 0}</p>
            </div>
            <button className="w-full bg-brown-700 text-white py-2 rounded hover:bg-brown-800">
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-brown-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) => setUser({...user, username: e.target.value})}
                      className="w-full p-3 border border-brown-200 rounded focus:ring-2 focus:ring-brown-500"
                    />
                  </div>
                  <div>
                    <label className="block text-brown-900 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      className="w-full p-3 border border-brown-200 rounded focus:ring-2 focus:ring-brown-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brown-700 text-white px-6 py-2 rounded hover:bg-brown-800"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                {Array.isArray(user.orders) && user.orders.length > 0 ? (
                  user.orders.map((order) => (
                    <div key={order._id} className="p-4 border border-brown-100 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-brown-900 font-semibold">Order #{order.orderId}</span>
                        <span className={`px-3 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-brown-600">Date: {new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-brown-600">Total: ${order.total}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-brown-600">No orders found.</p>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-brown-900 mb-2">Change Password</label>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-3 border border-brown-200 rounded focus:ring-2 focus:ring-brown-500"
                  />
                </div>
                <button className="bg-brown-700 text-white px-6 py-2 rounded hover:bg-brown-800">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
