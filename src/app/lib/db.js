import { Client } from "pg";

const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

export async function fetchProductsWithUsers() {
  await client.connect();

  const result = await client.query(`
    SELECT 
      products.id AS product_id,
      products.name AS product_name,
      products.price,
      products.stock,
      users.id AS user_id,
      users.name AS user_name,
      users.email AS user_email
    FROM 
      products
    JOIN 
      users ON products.user_id = users.id;
  `);

  await client.end();

  return result.rows;
}