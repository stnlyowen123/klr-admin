import { NextResponse } from "next/server";
import { Client } from "pg";

// Konfigurasi koneksi PostgreSQL
const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL, // Pastikan NEON_DATABASE_URL benar
});

// Sambungkan ke database
client.connect().catch((err) => console.error("Gagal koneksi ke database:", err));

export async function GET() {
  try {
    // Query SQL ditulis dalam backtick
    const query = `
      SELECT 
        pelanggan.id,
        pelanggan.nama,
        SUM(penjualan.jumlah * (produk.harga_jual - produk.harga_beli) + penjualan.jasa) AS total
      FROM penjualan
      JOIN produk ON penjualan.kode_produk = produk.kode_produk
      JOIN pelanggan ON penjualan.id_pelanggan = pelanggan.id
      GROUP BY pelanggan.id, pelanggan.nama
      ORDER BY total DESC
      LIMIT 5;
    `;

    // Eksekusi query
    const result = await client.query(query);

    // Return hasil dalam format JSON
    return NextResponse.json({
      message: "Success",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching top customers:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching top customers", error: errorMessage },
      { status: 500 }
    );
  }
}
