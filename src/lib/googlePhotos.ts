// Google Photos API Types and Client

export interface GooglePhoto {
  id: string;
  baseUrl: string;
  filename: string;
  mimeType: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
  };
  productUrl: string;
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

// Get access token using refresh token
async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google API credentials not configured");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch photos from Google Photos album
export async function fetchGooglePhotos(): Promise<Photo[]> {
  const albumId = process.env.GOOGLE_PHOTOS_ALBUM_ID;

  if (!albumId) {
    console.log("No Google Photos album ID configured, using demo photos");
    return getDemoPhotos();
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      "https://photoslibrary.googleapis.com/v1/mediaItems:search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId: albumId,
          pageSize: 100,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch photos from Google Photos");
    }

    const data = await response.json();
    const mediaItems: GooglePhoto[] = data.mediaItems || [];

    // Transform to our Photo format
    return mediaItems.map((item) => ({
      id: item.id,
      // Append =w1600-h1200 for high quality images
      src: `${item.baseUrl}=w1600-h1200`,
      alt: item.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      category: detectCategory(item.filename),
      width: parseInt(item.mediaMetadata.width) || 1600,
      height: parseInt(item.mediaMetadata.height) || 1200,
    }));
  } catch (error) {
    console.error("Error fetching Google Photos:", error);
    return getDemoPhotos();
  }
}

// Detect category from filename
function detectCategory(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes("gunung") || lower.includes("mountain")) return "Gunung";
  if (lower.includes("pantai") || lower.includes("beach")) return "Pantai";
  if (lower.includes("hutan") || lower.includes("forest")) return "Hutan";
  if (lower.includes("sunset") || lower.includes("sunrise")) return "Sunset";
  if (lower.includes("danau") || lower.includes("lake")) return "Danau";
  return "Alam";
}

// Demo photos using Unsplash (free high quality images)
export function getDemoPhotos(): Photo[] {
  return [
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=1200&fit=crop",
      alt: "Pegunungan Berkabut",
      category: "Gunung",
      width: 1600,
      height: 1200,
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1067&fit=crop",
      alt: "Pantai Tropis",
      category: "Pantai",
      width: 1600,
      height: 1067,
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=1067&fit=crop",
      alt: "Hutan Pinus",
      category: "Hutan",
      width: 1600,
      height: 1067,
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1600&h=1067&fit=crop",
      alt: "Sunset di Laut",
      category: "Sunset",
      width: 1600,
      height: 1067,
    },
    {
      id: "5",
      src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=1067&fit=crop",
      alt: "Puncak Gunung",
      category: "Gunung",
      width: 1600,
      height: 1067,
    },
    {
      id: "6",
      src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&h=1067&fit=crop",
      alt: "Pantai Pasir Putih",
      category: "Pantai",
      width: 1600,
      height: 1067,
    },
    {
      id: "7",
      src: "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?w=1600&h=1067&fit=crop",
      alt: "Hutan Hujan",
      category: "Hutan",
      width: 1600,
      height: 1067,
    },
    {
      id: "8",
      src: "https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=1600&h=1067&fit=crop",
      alt: "Golden Hour",
      category: "Sunset",
      width: 1600,
      height: 1067,
    },
    {
      id: "9",
      src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1600&h=1067&fit=crop",
      alt: "Himalaya",
      category: "Gunung",
      width: 1600,
      height: 1067,
    },
    {
      id: "10",
      src: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=1600&h=1067&fit=crop",
      alt: "Ombak Biru",
      category: "Pantai",
      width: 1600,
      height: 1067,
    },
    {
      id: "11",
      src: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=1600&h=1067&fit=crop",
      alt: "Hutan Bambu",
      category: "Hutan",
      width: 1600,
      height: 1067,
    },
    {
      id: "12",
      src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&h=1067&fit=crop",
      alt: "Sunset Reflection",
      category: "Sunset",
      width: 1600,
      height: 1067,
    },
    {
      id: "13",
      src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600&h=1067&fit=crop",
      alt: "Alpine View",
      category: "Gunung",
      width: 1600,
      height: 1067,
    },
    {
      id: "14",
      src: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1600&h=1067&fit=crop",
      alt: "Tebing Pantai",
      category: "Pantai",
      width: 1600,
      height: 1067,
    },
    {
      id: "15",
      src: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=1600&h=1067&fit=crop",
      alt: "Misty Forest",
      category: "Hutan",
      width: 1600,
      height: 1067,
    },
    {
      id: "16",
      src: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1600&h=1067&fit=crop",
      alt: "Ocean Sunset",
      category: "Sunset",
      width: 1600,
      height: 1067,
    },
  ];
}
