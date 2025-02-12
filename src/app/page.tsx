"use client";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./komponen/Sidebar";
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
import { Table, TableHead, TableRow, TableCell, TableBody } from "../components/ui/table";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interface untuk data
interface Produk {
  kode_produk: number;
  nama: string;
  harga_beli: number;
  harga_jual: number;
  jumlah_stok: number;
}

interface SalesOverview {
  dates: string[];
  totals: number[];
}

interface TopCustomer {
  id: number;
  nama: string;
  total: number;
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [salesData, setSalesData] = useState<SalesOverview | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);

  useEffect(() => {
    // Fetch Product Data
    async function fetchProduk() {
      const res = await fetch("/api/produk");
      const data = await res.json();
      setProduk(data.message === "Success" ? data.data : []);
    }

    // Fetch Sales Overview Data
    async function fetchSalesData() {
      const res = await fetch("/api/sales-overview");
      const data = await res.json();
    
      if (data.message === "Success") {
        const formattedData = {
          dates: data.data.map((item: { tanggal: string }) =>
            new Date(item.tanggal).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
          ),
          totals: data.data.map((item: { total_penjualan: string }) => parseFloat(item.total_penjualan)),
        };
    
        setSalesData(formattedData);
        console.log("Sales Data Response:", data);
console.log("Formatted Sales Data:", formattedData);

      }
    }    
    // Fetch Top Customers
    async function fetchTopCustomers() {
      const res = await fetch("/api/top-customers");
      const data = await res.json();
      setTopCustomers(data.message === "Success" ? data.data : []);
    }

    fetchProduk();
    fetchSalesData();
    fetchTopCustomers();
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <section className="flex-1 md:ml-64 p-8 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 rounded-lg shadow">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
            {salesData ? (
  <Bar
    data={{
      labels: salesData.dates,
      datasets: [
        {
          label: "Total Penjualan",
          data: salesData.totals,
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 1,
        },
      ],
    }}
    options={{
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Total Penjualan per Hari",
        },
      },
    }}
  />
) : (
  <p>Loading...</p>
)}

          </div>

          {/* Product List */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Product List</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>Harga Beli</TableCell>
                    <TableCell>Harga Jual</TableCell>
                    <TableCell>Stok</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produk.map((item) => (
                    <TableRow key={item.kode_produk}>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>Rp {item.harga_beli.toLocaleString()}</TableCell>
                      <TableCell>Rp {item.harga_jual.toLocaleString()}</TableCell>
                      <TableCell>{item.jumlah_stok}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        

          {/* Top Customers Table */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Pelanggan Ter-Loyal</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama</TableCell>
                    <TableCell>Total Pembelian</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.nama}</TableCell>
                      <TableCell>Rp {customer.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
