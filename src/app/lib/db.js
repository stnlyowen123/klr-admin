import { Client } from "pg";

const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

export async function fetchProductsWithUsers() {
  await client.connect();

  const result = await client.query(`
   SELECT 
        produck.kode_produk AS kode_produk,
        produk.nama AS nama,
        produk.harga_beli AS harga_beli,
        produk.harga_jual AS harga_jual
      FROM 
        produk
  `);

  await client.end();

  return result.rows;
}