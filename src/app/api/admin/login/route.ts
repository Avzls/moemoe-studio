import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { comparePassword, generateToken, getTokenCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password harus diisi" },
        { status: 400 }
      );
    }

    // Find admin user
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase tidak dikonfigurasi" },
        { status: 500 }
      );
    }

    const { data: admin, error } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await comparePassword(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({ id: admin.id, username: admin.username });

    // Set cookie
    const cookieOptions = getTokenCookieOptions();
    const response = NextResponse.json({ success: true, username: admin.username });
    response.cookies.set({
      ...cookieOptions,
      value: token,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
