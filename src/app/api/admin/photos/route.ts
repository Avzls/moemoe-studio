import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// Public: GET all photos (ordered by sort_order)
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase tidak dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil foto" },
      { status: 500 }
    );
  }
}

// Admin: POST upload photo metadata (file upload via /api/admin/upload)
export async function POST(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase tidak dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { title, category, image_url, width, height } = body;

    if (!title || !image_url) {
      return NextResponse.json(
        { error: "Title dan image_url harus diisi" },
        { status: 400 }
      );
    }

    // Get max sort_order
    const { data: maxOrder } = await supabaseAdmin
      .from("photos")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const sort_order = maxOrder ? maxOrder.sort_order + 1 : 0;

    const { data, error } = await supabaseAdmin
      .from("photos")
      .insert({
        title,
        category: category || "Alam",
        image_url,
        width: width || 1600,
        height: height || 1200,
        sort_order,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal menambahkan foto" },
      { status: 500 }
    );
  }
}

// Admin: DELETE photo
export async function DELETE(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase tidak dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Photo ID harus diisi" },
        { status: 400 }
      );
    }

    // Get photo to find the storage path
    const { data: photo } = await supabaseAdmin
      .from("photos")
      .select("image_url")
      .eq("id", id)
      .single();

    if (photo?.image_url) {
      // Extract path from Supabase storage URL
      const urlParts = photo.image_url.split("/storage/v1/object/public/");
      if (urlParts[1]) {
        const [bucket, ...pathParts] = urlParts[1].split("/");
        const filePath = pathParts.join("/");
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from("photos")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}
