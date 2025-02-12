import { NextResponse } from "next/server";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

client.connect().catch((err) => console.error("Gagal koneksi ke database:", err));

export async function GET() {
  try {
    const query = `
      SELECT 
        DATE(tanggal) AS tanggal,
        SUM(jumlah * (produk.harga_jual - produk.harga_beli) + penjualan.jasa) AS total_penjualan
      FROM penjualan
      JOIN produk ON penjualan.kode_produk = produk.kode_produk
      GROUP BY DATE(tanggal)
      ORDER BY tanggal;
    `;
    const result = await client.query(query);

    // Kembalikan respons dengan header eksplisit
    return NextResponse.json(
      {
        message: "Success",
        data: result.rows,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching sales overview:", error);

    return NextResponse.json(
      { message: "Error fetching sales overview", error: error instanceof Error ? error.message : "Unknown error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
