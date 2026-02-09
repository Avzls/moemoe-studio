# MoeMoe Photo - Nature Photography Gallery

Website portfolio gallery untuk bisnis penjualan foto alam dengan tema dark modern, animasi smooth, dan integrasi Google Photos API.

![Preview](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop)

## ✨ Features

- 🌙 Dark theme dengan desain modern dan minimalis
- 📱 Mobile-first responsive design
- 🖼️ Masonry grid layout untuk foto
- 🔍 Lightbox dengan keyboard navigation (ESC, ←, →)
- 📂 Filter kategori (Gunung, Pantai, Hutan, Sunset)
- ⚡ Lazy loading untuk performa optimal
- 💬 WhatsApp integration dengan pre-filled message
- 🔄 Auto-sync foto dari Google Photos (opsional)
- 🚀 Deploy ready untuk Vercel

## 🛠️ Tech Stack

- **Next.js 14** - App Router, SSR, Image Optimization
- **Tailwind CSS** - Styling
- **Framer Motion** - Animasi
- **Google Photos API** - Auto-sync foto (opsional)
- **Lucide React** - Icons

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd gallery
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan konfigurasi Anda.

### 3. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📸 Google Photos API Setup (Opsional)

Jika ingin auto-sync foto dari Google Photos album:

### Step 1: Create Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project atau pilih existing project
3. Catat **Project ID**

### Step 2: Enable Photos Library API

1. Di sidebar, pilih **APIs & Services** > **Library**
2. Search "Photos Library API"
3. Klik **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Di sidebar, pilih **APIs & Services** > **Credentials**
2. Klik **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Jika diminta, configure **OAuth consent screen**:
   - User Type: **External**
   - App name: `MoeMoe Photo`
   - Support email: email Anda
   - Scopes: tambahkan `.../auth/photoslibrary.readonly`
   - Test users: tambahkan email Google Photos Anda
4. Create OAuth client:
   - Application type: **Web application**
   - Name: `MoeMoe Photo Web`
   - Authorized redirect URIs: `https://developers.google.com/oauthplayground`
5. Catat **Client ID** dan **Client Secret**

### Step 4: Get Refresh Token

1. Buka [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Klik ⚙️ (Settings) di kanan atas
3. Centang "Use your own OAuth credentials"
4. Masukkan **Client ID** dan **Client Secret**
5. Di sidebar kiri, scroll ke "Photos Library API v1"
6. Pilih `https://www.googleapis.com/auth/photoslibrary.readonly`
7. Klik **Authorize APIs** dan login dengan akun Google Photos
8. Klik **Exchange authorization code for tokens**
9. Catat **Refresh token**

### Step 5: Get Album ID

1. Buka Google Photos di browser
2. Buat album baru atau buka album existing
3. Kopid ID dari URL: `https://photos.google.com/album/AF1QipN...`
   - Album ID adalah string setelah `/album/`

### Step 6: Update Environment Variables

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_PHOTOS_ALBUM_ID=your_album_id
```

## 🎯 Tanpa Google Photos API

Website tetap berfungsi dengan **demo photos** dari Unsplash jika Google Photos tidak dikonfigurasi. Anda juga bisa:

1. Edit `src/lib/googlePhotos.ts`
2. Modifikasi fungsi `getDemoPhotos()` dengan foto Anda sendiri
3. Atau upload foto ke `public/photos/` dan update path di code

## 🚀 Deploy ke Vercel

### Option 1: Deploy via GitHub

1. Push project ke GitHub repository
2. Buka [Vercel](https://vercel.com)
3. Klik **New Project**
4. Import repository dari GitHub
5. Di **Environment Variables**, tambahkan semua variabel dari `.env.local`
6. Klik **Deploy**

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Untuk production
vercel --prod
```

### Post-Deploy

1. Update `NEXT_PUBLIC_SITE_URL` dengan domain Vercel Anda
2. (Opsional) Tambahkan custom domain di Vercel dashboard

## 📁 Project Structure

```
gallery/
├── src/
│   ├── app/
│   │   ├── api/photos/     # API route untuk fetch photos
│   │   ├── gallery/        # Gallery page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout dengan SEO
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── CategoryFilter.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Lightbox.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── MasonryGrid.tsx
│   │   └── PhotoCard.tsx
│   └── lib/
│       └── googlePhotos.ts # Google Photos API client
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## 🎨 Customization

### Ganti Brand Name & Tagline

Edit `src/components/HeroSection.tsx`:

```tsx
<h1>MoeMoe Photo</h1>
<p>Keindahan Alam dalam Setiap Frame</p>
```

### Ganti Nomor WhatsApp

Search `6281911205501` dan ganti dengan nomor Anda.

### Ganti Warna Theme

Edit CSS variables di `src/app/globals.css`:

```css
:root {
  --accent: #8b5cf6; /* Warna utama */
  --accent-light: #a78bfa;
}
```

### Tambah Kategori

Edit `src/app/gallery/page.tsx`:

```tsx
const CATEGORIES = ["Semua", "Gunung", "Pantai", "Hutan", "Sunset", "Danau"];
```

## 📝 License

MIT License - Feel free to use for your own project!

## 💬 Contact

- **WhatsApp**: [6281911205501](https://wa.me/6281911205501)

---

Made with ❤️ by MoeMoe Photo
