import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

// One-time seed endpoint to create the first admin user
// Only works if no admin users exist yet
export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase tidak dikonfigurasi" },
        { status: 500 }
      );
    }

    // Check if admin already exists
    const { data: existing } = await supabaseAdmin
      .from("admin_users")
      .select("id")
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Admin user sudah ada. Seed tidak bisa dijalankan lagi." },
        { status: 403 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Username dan password (min 6 karakter) harus diisi" },
        { status: 400 }
      );
    }

    const password_hash = await hashPassword(password);

    const { error } = await supabaseAdmin
      .from("admin_users")
      .insert({ username, password_hash });

    if (error) {
      return NextResponse.json(
        { error: "Gagal membuat admin: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Admin "${username}" berhasil dibuat!`,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
