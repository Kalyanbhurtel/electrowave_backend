"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, status } = await axios.get('http://localhost:8000/api/admin/dashboard');
        if (status !== 200) {
          throw new Error(`Failed to fetch products: ${status}`);
        }
        setData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading && !data) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="py-4">
      <div className="flex gap-4">
        <div className="p-4 text-center space-y-2 border rounded-md shadow-md">
          <p>Total Users</p>
          <p>{(data && data.totalUsers) ? data.totalUsers : ""}</p>
        </div>

        <div className="p-4 text-center space-y-2 border rounded-md shadow-md">
          <p>Total Products</p>
          <p>{(data && data.totalProducts) ? data.totalProducts : ""}</p>
        </div>

        <div className="p-4 text-center space-y-2 border rounded-md shadow-md">
          <p>Total Orders</p>
          <p>{(data && data.totalOrders) ? data.totalOrders : ""}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;