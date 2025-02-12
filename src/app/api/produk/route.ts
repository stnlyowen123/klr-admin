import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Client } from "pg";

// Konfigurasi database
const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

// Sambungkan ke database
client.connect().catch((err) => console.error("Failed to connect to database:", err));

// Direktori untuk menyimpan file gambar
const uploadsDir = path.join(process.cwd(), "public/uploads");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const kode_produk = formData.get("kode_produk");
    const nama = formData.get("nama");
    const harga_beli = formData.get("harga_beli");
    const harga_jual = formData.get("harga_jual");
    const jumlah_stok = formData.get("jumlah_stok");
    const foto = formData.get("foto") as File;

    // Validasi input
    if (!kode_produk || !nama || !harga_beli || !harga_jual || !jumlah_stok || !foto) {
      return NextResponse.json(
        { message: "Invalid input. All fields are required." },
        { status: 400 }
      );
    }

    // Simpan foto di direktori lokal
    const imagePath = path.join(uploadsDir, foto.name);
    await fs.mkdir(uploadsDir, { recursive: true }); // Buat folder jika belum ada
    await fs.writeFile(imagePath, Buffer.from(await foto.arrayBuffer()));

    // URL untuk mengakses foto
    const fotoUrl = `/uploads/${foto.name}`;

    // Simpan data produk ke database
    const query = `
      INSERT INTO produk (kode_produk, nama, harga_beli, harga_jual, jumlah_stok, foto) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [kode_produk, nama, harga_beli, harga_jual, jumlah_stok, fotoUrl];

    await client.query(query, values);

    return NextResponse.json({ message: "Product added successfully" });
  } catch (err) {
    const error = err as Error;
    console.error("Error occurred during product addition:", error.message, error.stack);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const query = `
      SELECT 
        kode_produk, 
        nama, 
        harga_beli, 
        harga_jual, 
        jumlah_stok, 
        foto 
      FROM produk
    `;
    const result = await client.query(query);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No products found", data: [] });
    }

    return NextResponse.json({ message: "Success", data: result.rows });
  } catch (err) {
    const error = err as Error;
    console.error("Error occurred while fetching products:", error.message, error.stack);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
