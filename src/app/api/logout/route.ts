import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" });
  response.cookies.delete("user"); // Hapus cookie user
  return response;
}
