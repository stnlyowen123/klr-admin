import { NextResponse } from "next/server";
import { Client } from "pg";

// Konfigurasi koneksi database
const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

// Sambungkan ke database
client.connect().catch((err) => console.error("Database connection failed:", err));

export async function GET() {
  try {
    // Query untuk mendapatkan kode produk terakhir
    const result = await client.query(`
      SELECT MAX(CAST(kode_produk AS INTEGER)) AS last_code FROM produk
    `);

    const lastCode = result.rows[0]?.last_code || "0"; // Menggunakan alias sesuai query

    return NextResponse.json({ message: "Success", lastCode });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching last product code:", err.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
