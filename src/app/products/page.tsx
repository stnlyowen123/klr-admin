'use client';

import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../komponen/Sidebar"; // Import Sidebar component
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../../components/ui/table";

type Produk = {
  kode_produk: number;
  nama: string;
  harga_beli: number;
  harga_jual: number;
  jumlah_stok: number;
};

export default function ProdukPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [produk, setProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduk() {
      try {
        const response = await fetch("/api/produk");
        const result = await response.json();

        if (result.message === "Success") {
          setProduk(result.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error); // Log error ke console
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    }

    void fetchProduk(); // Explicitly ignore floating promise dengan `void`
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <section className="flex-1 md:ml-64 p-6 space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-black text-white px-6 py-4 rounded-lg shadow-md">
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-2xl font-bold">Products</h1>
        </header>

        {/* Tabel Produk */}
        <Card className="rounded-lg shadow-lg border border-gray-200">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">Daftar Produk</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full text-left">
                <TableHead className="bg-gray-50">
                  <TableRow>
                    <TableCell className="font-semibold text-gray-700 py-2 px-4">Kode Produk</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-2 px-4">Nama</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-2 px-4">Harga Beli</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-2 px-4">Harga Jual</TableCell>
                    <TableCell className="font-semibold text-gray-700 py-2 px-4">Stok</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produk.map((item) => (
                    <TableRow key={item.kode_produk} className="hover:bg-gray-100">
                      <TableCell className="py-2 px-4">{item.kode_produk}</TableCell>
                      <TableCell className="py-2 px-4">{item.nama}</TableCell>
                      <TableCell className="py-2 px-4">Rp {item.harga_beli.toLocaleString()}</TableCell>
                      <TableCell className="py-2 px-4">Rp {item.harga_jual.toLocaleString()}</TableCell>
                      <TableCell className="py-2 px-4">{item.jumlah_stok}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
