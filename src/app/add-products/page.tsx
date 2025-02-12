"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Sidebar from "../komponen/Sidebar";

export default function AddProducts() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    kode_produk: "",
    nama: "",
    harga_beli: "",
    harga_jual: "",
    jumlah_stok: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch the last product code and auto-generate the next code
    async function fetchLastProductCode() {
      try {
        const response = await fetch("/api/produk/last-code");
        const data = await response.json();
        if (response.ok && data.message === "Success" && data.lastCode) {
          const nextCode = parseInt(data.lastCode) + 1;
          setFormData((prev) => ({ ...prev, kode_produk: nextCode.toString() }));
        }
      } catch (error) {
        console.error("Error fetching last product code:", error);
      }
    }

    fetchLastProductCode();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("kode_produk", formData.kode_produk);
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("harga_beli", formData.harga_beli);
    formDataToSend.append("harga_jual", formData.harga_jual);
    formDataToSend.append("jumlah_stok", formData.jumlah_stok);
    if (image) formDataToSend.append("foto", image);

    try {
      const response = await fetch("/api/produk", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Produk berhasil ditambahkan!");
        router.push("/products");
      } else {
        const errorData = await response.json();
        alert(`Gagal menambahkan produk: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <section className="flex-1 p-6 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Tambah Produk</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <div>
            <Label htmlFor="kode_produk">Kode Produk</Label>
            <Input
              id="kode_produk"
              name="kode_produk"
              type="text"
              value={formData.kode_produk}
              onChange={handleChange}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="nama">Nama Produk</Label>
            <Input
              id="nama"
              name="nama"
              type="text"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="harga_beli">Harga Beli</Label>
            <Input
              id="harga_beli"
              name="harga_beli"
              type="number"
              value={formData.harga_beli}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="harga_jual">Harga Jual</Label>
            <Input
              id="harga_jual"
              name="harga_jual"
              type="number"
              value={formData.harga_jual}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="jumlah_stok">Jumlah Stok</Label>
            <Input
              id="jumlah_stok"
              name="jumlah_stok"
              type="number"
              value={formData.jumlah_stok}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="foto">Upload Foto</Label>
            <Input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark">
            Tambah Produk
          </Button>
        </form>
      </section>
    </main>
  );
}
