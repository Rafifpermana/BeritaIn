// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect, useRef } from "react"; // Tambahkan useState, useEffect, useRef jika belum ada
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageCircleWarning,
  Megaphone,
  LogOut,
  Bell,
  Shield,
} from "lucide-react";

const AdminDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminName = "Admin Utama";
  const adminAvatarPlaceholder = "/placeholder-avatar-admin.png";

  const sidebarLinks = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Manajemen Pengguna", icon: Users, path: "/admin/dashboard/users" },
    {
      name: "Moderasi Komentar",
      icon: MessageCircleWarning,
      path: "/admin/dashboard/comments",
    },
    {
      name: "Kirim Pengumuman",
      icon: Megaphone,
      path: "/admin/dashboard/broadcast",
    },
  ];

  const [isAdminNotificationsOpen, setIsAdminNotificationsOpen] =
    useState(false);
  const adminNotificationButtonRef = useRef(null);
  const adminNotificationPanelRef = useRef(null);

  const handleLogout = () => {
    console.log("Admin logout...");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminNotificationPanelRef.current &&
        !adminNotificationPanelRef.current.contains(event.target) &&
        adminNotificationButtonRef.current &&
        !adminNotificationButtonRef.current.contains(event.target)
      ) {
        setIsAdminNotificationsOpen(false);
      }
    };
    if (isAdminNotificationsOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAdminNotificationsOpen]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header Admin Dashboard */}
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-xl font-semibold"
              >
                <Shield size={28} className="text-sky-400" />
                <span>Admin Panel</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                ref={adminNotificationButtonRef}
                onClick={() => setIsAdminNotificationsOpen((prev) => !prev)}
                className="p-1.5 rounded-full hover:bg-slate-700 focus:outline-none relative"
              >
                <Bell size={22} />
                {/* Anda bisa menambahkan indikator notifikasi di sini jika ada */}
              </button>
              {isAdminNotificationsOpen && (
                <div
                  ref={adminNotificationPanelRef}
                  className="absolute top-14 right-4 sm:right-6 lg:right-8 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 text-gray-800 z-50"
                >
                  <div className="p-3 border-b font-semibold">
                    Notifikasi Admin
                  </div>
                  <div className="p-3 text-sm text-gray-500">
                    Tidak ada notifikasi baru.
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full object-cover border-2 border-sky-400"
                  src={adminAvatarPlaceholder}
                  alt="Admin Avatar"
                />
                <span className="text-sm font-medium hidden sm:block">
                  {adminName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Konten Admin Dashboard dengan Sidebar */}
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:flex lg:items-start lg:space-x-6">
          {/* Sidebar Admin */}
          <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0 mb-6 lg:mb-0">
            <div className="bg-white p-4 rounded-xl shadow-lg h-full flex flex-col justify-between border border-gray-200">
              {" "}
              {/* Shadow lebih jelas */}
              <nav className="space-y-1.5">
                {sidebarLinks.map((link) => {
                  // --- PERBAIKAN LOGIKA isActive ---
                  let isActive;
                  if (link.path === "/admin/dashboard") {
                    // Untuk link "Overview" atau path dasar dashboard admin, cocokkan persis
                    isActive = location.pathname === link.path;
                  } else {
                    // Untuk link lain, izinkan pencocokan awalan untuk sub-rute
                    isActive =
                      location.pathname === link.path ||
                      location.pathname.startsWith(link.path + "/");
                  }
                  // --- AKHIR PERBAIKAN LOGIKA isActive ---
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors 
                                  ${
                                    isActive
                                      ? "bg-sky-600 text-white shadow-sm" // Warna aktif diubah menjadi sky-600
                                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                  }`}
                    >
                      <link.icon
                        size={18}
                        className={`mr-3 flex-shrink-0 
                                    ${
                                      isActive
                                        ? "text-white"
                                        : "text-slate-400 group-hover:text-slate-500"
                                    }`}
                      />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-6 pt-4 border-t border-gray-200">
                {" "}
                {/* mt-6 untuk jarak */}
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:bg-red-100 hover:text-red-700 transition-colors" // Hover state lebih jelas
                >
                  <LogOut
                    size={18}
                    className="mr-3 text-slate-400 group-hover:text-red-600"
                  />{" "}
                  {/* Warna ikon hover */}
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Panel Admin */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
