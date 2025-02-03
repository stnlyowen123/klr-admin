import { NextResponse } from "next/server";
import { Client } from "pg";

// Konfigurasi database
const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

// Sambungkan ke database
client.connect().catch((err) => console.error("Failed to connect to database:", err));

export async function GET() {
  try {
    console.log("API /api/products hit");
    console.log("Executing query...");

    const result = await client.query(`
      SELECT 
        products.id AS product_id,
        products.name AS product_name,
        products.price,
        products.stock,
        users.users_id AS user_id,
        users.name AS user_name,
        users.email AS user_email
      FROM 
        products
      JOIN 
        users ON products.user_id = users.users_id;
    `);

    console.log("Query successful:", result.rows);

    return NextResponse.json({ message: "Success", data: result.rows });
  } catch (err) {
    const error = err as Error;
    console.error("Error occurred:", error.message);

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
