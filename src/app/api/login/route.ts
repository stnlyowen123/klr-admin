import { NextResponse } from "next/server";
import { Client } from "pg"; // PostgreSQL client

const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL, // Pastikan ENV diatur dengan benar
});

client.connect().catch((err) => console.error("Gagal koneksi ke database:", err));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, password } = body;

    if (!name || !password) {
      return NextResponse.json({ message: "Nama dan password wajib diisi" }, { status: 400 });
    }

    const result = await client.query(
      "SELECT * FROM users WHERE name = $1 AND password = $2",
      [name, password]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Nama atau password salah" }, { status: 401 });
    }

    const user = result.rows[0];

    // Kirim response dengan cookie
    const response = NextResponse.json({
      message: "Login berhasil",
      user,
    });

    response.cookies.set("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
