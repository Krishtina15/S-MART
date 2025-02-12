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
    Legend
} from "recharts";

const Dashboard = () => {
    const { authUser } = useAuthContext();
    const [salesData, setSalesData] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            if (authUser?._id) {
                try {
                    const salesResponse = await axios.get(
                        `http://localhost:8000/api/productSales/weeklySales/${authUser._id}`
                    );

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
                        `http://localhost:8000/api/productSales/salesBy/${authUser._id}`
                    );
                    
                    // Filter out any sales with null productId before setting state
                    const validSales = (recentSalesResponse.data.sales || []).filter(
                        sale => sale && sale.productId
                    );
                    setRecentSales(validSales);
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
    }, [authUser]);

    if (loading) {
        return <div className="text-amber-900">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-800">{error}</div>;
    }

    if (!authUser) {
        return <div className="text-amber-900">Please login to see the Dashboard</div>;
    }

    return (
        <div className="p-6 bg-amber-50">
            <h1 className="text-2xl font-bold mb-4 text-amber-900">Sales Dashboard</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-brown-600 text-amber-50 p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg">Total Sales</h2>
                    <p className="text-2xl font-bold">{totalSales}</p>
                </div>
                <div className="bg-amber-700 text-amber-50 p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg">Total Revenue</h2>
                    <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-lg border border-amber-200">
                    <h2 className="text-lg font-bold mb-4 text-amber-900">Weekly Sales Count</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                            data={salesData}
                            barSize={40}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#d6b088" />
                            <XAxis 
                                dataKey="weekNumber"
                                stroke="#92400e"
                                padding={{ left: 20, right: 20 }}
                            />
                            <YAxis stroke="#92400e" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fef3c7',
                                    border: '1px solid #92400e'
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="totalSales" 
                                fill="#92400e" 
                                name="Sales Count"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-lg border border-amber-200">
                    <h2 className="text-lg font-bold mb-4 text-amber-900">Weekly Revenue</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                            data={salesData}
                            barSize={40}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#d6b088" />
                            <XAxis 
                                dataKey="weekNumber"
                                stroke="#92400e"
                                padding={{ left: 20, right: 20 }}
                            />
                            <YAxis stroke="#92400e" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fef3c7',
                                    border: '1px solid #92400e'
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="totalRevenue" 
                                fill="#b45309" 
                                name="Revenue ($)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg mt-6 border border-amber-200">
                <h2 className="text-lg font-bold mb-4 text-amber-900">Recent Sales</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-amber-200">
                            <th className="p-2 text-left text-amber-900">Product</th>
                            <th className="p-2 text-left text-amber-900">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentSales.map((sale) => (
                            <tr key={sale._id} className="border-b border-amber-200 hover:bg-amber-50">
                                <td className="p-2 text-amber-900">
                                    {sale.productId?.productName || 'Product Unavailable'}
                                </td>
                                <td className="p-2 text-amber-900">
                                    ${sale.productId?.price?.toFixed(2) || '0.00'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;