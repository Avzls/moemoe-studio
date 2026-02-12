"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  LayoutDashboard,
  UserCircle,
  ImageIcon,
  Tag,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/biodata", label: "Biodata", icon: UserCircle },
  { href: "/admin/photos", label: "Photos", icon: ImageIcon },
  { href: "/admin/categories", label: "Kategori", icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthenticated(true);
      return;
    }

    // Check auth by calling a protected endpoint
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/photos");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        setAuthenticated(true);
      } catch {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Show login page without admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 flex-shrink-0 lg:sticky lg:top-0 lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-900 flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Moemoe Cipluk</h2>
              <span className="text-gray-500 text-xs">Admin Panel</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-2 mt-1 rounded-xl text-xs text-gray-500 hover:text-accent transition-colors"
          >
            ← Kembali ke website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar (mobile) */}
        <div className="lg:hidden sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-white text-sm">Admin</span>
        </div>

        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
