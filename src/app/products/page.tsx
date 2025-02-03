'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/Sidebar"; // Import Sidebar component

type Product = {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const result = await response.json();

        if (result.message === "Success") {
          setProducts(result.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

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
          <h1 className="text-2xl font-bold">Products</h1>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.product_id}
              className="p-6 bg-orange-100 text-black rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <h2 className="text-xl font-bold">{product.product_name}</h2>
              <p className="text-lg">Price: ${product.price}</p>
              <p className="text-lg">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}