import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moemoe Cipluk | Foto Alam Berkualitas Tinggi",
  description: "Koleksi foto alam berkualitas HD untuk mempercantik ruangan, proyek kreatif, dan kebutuhan visual Anda. Gunung, pantai, hutan, dan sunset.",
  keywords: ["foto alam", "nature photography", "foto gunung", "foto pantai", "foto hutan", "foto sunset", "wallpaper alam", "Moemoe Cipluk"],
  authors: [{ name: "Moemoe Cipluk" }],
  openGraph: {
    title: "Moemoe Cipluk | Foto Alam Berkualitas Tinggi",
    description: "Koleksi foto alam berkualitas HD untuk mempercantik ruangan, proyek kreatif, dan kebutuhan visual Anda.",
    type: "website",
    locale: "id_ID",
    siteName: "Moemoe Cipluk",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moemoe Cipluk | Foto Alam Berkualitas Tinggi",
    description: "Koleksi foto alam berkualitas HD untuk mempercantik ruangan, proyek kreatif, dan kebutuhan visual Anda.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
