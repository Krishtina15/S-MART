import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import {
  LayoutDashboard,
  Users,
  RefreshCcw,
  MessageSquare,
  Package,
  ShoppingCart,
  Settings,
  Bell,
  Search,
} from 'lucide-react';

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [productsSold, setProductsSold] = useState([]);
  const [productsBought, setProductsBought] = useState([]);
  const [toSellProducts, setToSellProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, soldRes, boughtRes, toSellRes] = await Promise.all([
          axios.get('/api/sales'),
          axios.get('/api/products/sold'),
          axios.get('/api/products/bought'),
          axios.get('/api/products/tosell'),
        ]);

        setSalesData(salesRes.data);
        setProductsSold(soldRes.data);
        setProductsBought(boughtRes.data);
        setToSellProducts(toSellRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-[#F5EBE0]">
      {/* Sidebar */}
      <div className="w-64 bg-[#8B4513] text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Your Company</h1>
        </div>

        <nav className="space-y-2">
          <div className="flex items-center space-x-3 p-2 bg-[#A0522D] rounded-lg">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </div>
          {[
            { icon: <Users size={20} />, label: 'Summary' },
            { icon: <Package size={20} />, label: 'Products' },
            { icon: <ShoppingCart size={20} />, label: 'Orders' },
            { icon: <Settings size={20} />, label: 'Settings' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-[#A0522D] rounded-lg cursor-pointer"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#8B4513]">Welcome back!</h2>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6 text-[#8B4513] cursor-pointer" />
            <Bell className="w-6 h-6 text-[#8B4513] cursor-pointer" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#A0522D]">
            <h3 className="text-lg font-semibold text-[#8B4513]">Total Sales</h3>
            <p className="text-3xl font-bold text-[#A0522D]">$45,678</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#A0522D]">
            <h3 className="text-lg font-semibold text-[#8B4513]">Products Sold</h3>
            <p className="text-3xl font-bold text-[#A0522D]">{productsSold.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#A0522D]">
            <h3 className="text-lg font-semibold text-[#8B4513]">To Be Sold</h3>
            <p className="text-3xl font-bold text-[#A0522D]">{toSellProducts.length}</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#A0522D] mb-8">
          <h2 className="text-xl font-bold text-[#8B4513] mb-4">Sales Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8B4513" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Products Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#A0522D]">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4">Products Sold</h2>
            <div className="space-y-4">
              {productsSold.map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center p-3 bg-[#F5EBE0] rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-[#8B4513]">{product.name}</p>
                    <p className="text-sm text-[#A0522D]">${product.price}</p>
                  </div>
                  <span className="text-sm text-[#8B4513]">{product.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#A0522D]">
            <h2 className="text-xl font-bold text-[#8B4513] mb-4">Products Bought</h2>
            <div className="space-y-4">
              {productsBought.map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center p-3 bg-[#F5EBE0] rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-[#8B4513]">{product.name}</p>
                    <p className="text-sm text-[#A0522D]">${product.price}</p>
                  </div>
                  <span className="text-sm text-[#8B4513]">{product.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;