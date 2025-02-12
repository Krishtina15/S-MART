import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
    const { authUser } = useAuthContext();
    const [salesData, setSalesData] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
    
        if (authUser ?._id) { // Check if authUser  and its _id exist
            try {
                const salesResponse = await axios.get(
                    `http://localhost:8000/api/weeklySales?sellerId=${authUser ._id}`
                );
    
                console.log("Sales Response:", salesResponse.data); // Log the response data
    
                // Check if salesResponse.data is an array
                if (Array.isArray(salesResponse.data)) {
                    setSalesData(salesResponse.data);
    
                    const totalSalesCount = salesResponse.data.reduce(
                        (sum, entry) => sum + entry.totalSales,
                        0
                    );
                    const totalRevenueCount = salesResponse.data.reduce(
                        (sum, entry) => sum + entry.totalRevenue,
                        0
                    );
    
                    setTotalSales(totalSalesCount);
                    setTotalRevenue(totalRevenueCount);
                } else {
                    setError("Sales data is not in the expected format.");
                }
    
                const recentSalesResponse = await axios.get(
                    `http://localhost:8000/api/salesBy/${authUser ._id}`
                );
                setRecentSales(recentSalesResponse.data.sales || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Error fetching data. Please try again later.");
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

        fetchData();
    }, [authUser]); // authUser is the correct dependency

    if (loading) {
        return <div>Loading...</div>; // Display a loading message
    }

    if (error) {
        return <div>{error}</div>; // Display an error message
    }

    if (!authUser) {
      return <div>Please login to see the Dashboard</div>;
    }



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg">Total Sales</h2>
                    <p className="text-2xl font-bold">{totalSales}</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg">Total Revenue</h2>
                    <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Weekly Sales Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id.week" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalSales" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
                <h2 className="text-lg font-bold mb-4">Recent Sales</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left">Product</th>
                            <th className="p-2 text-left">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentSales.map((sale) => (
                            <tr key={sale._id} className="border-b">
                                <td className="p-2">{sale.productId.productName}</td>
                                <td className="p-2">${sale.productId.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
