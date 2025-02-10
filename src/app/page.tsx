"use client";
import Link from "next/link";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../app/components/Sidebar"; // Import Sidebar component
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Table } from "../components/ui/table";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data for the sales chart
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 1900, 3000, 5000, 2300, 3400, 4800, 3200, 2000, 2700, 3300, 4000],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <section className="flex-1 md:ml-64 p-8 flex flex-col gap-6">
        <header className="flex justify-between items-center bg-black text-white p-4 rounded-lg">
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

        <div className="flex gap-6">
        {/* Sales Chart */}
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2">
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <Bar data={salesData} />
        </div>
        {/* Product Table */}
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2">
          <h2 className="text-xl font-bold mb-4">Product List</h2>
          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>T-Shirt</td>
                <td>Clothing</td>
                <td>$25</td>
                <td>120</td>
              </tr>
              <tr>
                <td>Hoodie</td>
                <td>Clothing</td>
                <td>$40</td>
                <td>80</td>
              </tr>
            </tbody>
          </Table>
        </div>
        </div>
        <div className="flex gap-6">
        {/* User Table */}
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2">
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Admin</td>
              </tr>
            </tbody>
          </Table>
        </div>

        {/* Daily/Monthly/Yearly Sales Table */}
        <div className="p-6 bg-white rounded-lg shadow-lg w-1/2">
          <h2 className="text-xl font-bold mb-4">Pelanggan Ter-Loyal</h2>
          <Table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Total Sales</th>
                <th>Service Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Daily</td>
                <td>$1200</td>
                <td>35</td>
              </tr>
              <tr>
                <td>Monthly</td>
                <td>$34,000</td>
                <td>1020s</td>
              </tr>
              <tr>
                <td>Yearly</td>
                <td>$400,0001</td>
                <td>12,000</td>
              </tr>
            </tbody>
          </Table>
        </div>
        </div>
      </section>
    </main>
  );
}
