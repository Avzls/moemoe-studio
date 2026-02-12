import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// Public: GET all categories
export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json([
      { id: "1", name: "Alam", slug: "alam" },
      { id: "2", name: "Gunung", slug: "gunung" },
      { id: "3", name: "Pantai", slug: "pantai" },
      { id: "4", name: "Hutan", slug: "hutan" },
      { id: "5", name: "Sunset", slug: "sunset" },
      { id: "6", name: "Danau", slug: "danau" },
    ]);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

// Admin: POST new category
export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase tidak dikonfigurasi" }, { status: 500 });
  }

  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Nama kategori harus diisi" }, { status: 400 });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    // Get max sort_order
    const { data: maxOrder } = await supabaseAdmin
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const sort_order = maxOrder ? maxOrder.sort_order + 1 : 0;

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert({ name: name.trim(), slug, sort_order })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Kategori sudah ada" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan kategori" }, { status: 500 });
  }
}

// Admin: DELETE category
export async function DELETE(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase tidak dikonfigurasi" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID harus diisi" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus kategori" }, { status: 500 });
  }
}
