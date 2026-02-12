import { NextResponse } from "next/server";
import { fetchGooglePhotos, getDemoPhotos } from "@/lib/googlePhotos";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Try Supabase first (if configured)
    if (supabaseAdmin) {
      const { data: supabasePhotos } = await supabaseAdmin
        .from("photos")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      const photos = (supabasePhotos || []).map((p) => ({
        id: p.id,
        src: p.image_url,
        alt: p.title,
        category: p.category,
        width: p.width || 1600,
        height: p.height || 1200,
      }));
      return NextResponse.json({ photos, source: "supabase" });
    }

    // Fallback: Check if Google Photos API is configured
    const hasGoogleConfig =
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_PHOTOS_ALBUM_ID;

    if (hasGoogleConfig) {
      const photos = await fetchGooglePhotos();
      return NextResponse.json({ photos, source: "google-photos" });
    } else {
      // Return demo photos if not configured
      const photos = getDemoPhotos();
      return NextResponse.json({ photos, source: "demo" });
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    // Fallback to demo photos on error
    const photos = getDemoPhotos();
    return NextResponse.json({ photos, source: "demo-fallback" });
  }
}
