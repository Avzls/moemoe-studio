import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdmin } from "@/lib/auth";

// Public: GET profile
export async function GET() {
  try {
    if (!supabaseAdmin) {
      // Return default profile if Supabase not configured
      return NextResponse.json({
        name: "Moemoe Cipluk",
        bio: "Nature Photography • Keindahan Alam dalam Setiap Frame ✨",
        location: "Indonesia",
        avatar_url: null,
        social_links: [
          {
            type: "whatsapp",
            url: "https://wa.me/6281911205501",
            label: "WhatsApp",
          },
        ],
      });
    }

    const { data, error } = await supabaseAdmin
      .from("profile")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({
        name: "Moemoe Cipluk",
        bio: "Nature Photography • Keindahan Alam dalam Setiap Frame ✨",
        location: "Indonesia",
        avatar_url: null,
        social_links: [
          {
            type: "whatsapp",
            url: "https://wa.me/6281911205501",
            label: "WhatsApp",
          },
        ],
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil profil" },
      { status: 500 }
    );
  }
}

// Admin: PUT update profile
export async function PUT(request: Request) {
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
    const { name, bio, location, avatar_url, social_links } = body;

    // Get existing profile ID
    const { data: existing } = await supabaseAdmin
      .from("profile")
      .select("id")
      .limit(1)
      .single();

    if (!existing) {
      const { data, error } = await supabaseAdmin
        .from("profile")
        .insert({
          name,
          bio,
          location,
          avatar_url,
          social_links,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    const { data, error } = await supabaseAdmin
      .from("profile")
      .update({
        name,
        bio,
        location,
        avatar_url,
        social_links,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengupdate profil" },
      { status: 500 }
    );
  }
}
