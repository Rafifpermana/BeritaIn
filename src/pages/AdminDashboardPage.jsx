// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageCircleWarning,
  Settings2,
  LogOut,
  Bell,
  Shield,
  Megaphone,
  Menu,
  X as CloseIcon,
} from "lucide-react";
import ClientPortal from "../utils/Portal"; // Pastikan path ini benar

const AdminDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminName = "Admin Utama";
  const adminAvatarPlaceholder = "/placeholder-avatar-admin.png"; // Ganti dengan path avatar admin Anda

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
    {
      name: "Pengaturan Situs",
      icon: Settings2,
      path: "/admin/dashboard/settings",
    },
  ];

  const [isAdminNotificationsOpen, setIsAdminNotificationsOpen] =
    useState(false);
  const adminNotificationButtonRef = useRef(null);
  const adminNotificationPanelRef = useRef(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const mobileSidebarRef = useRef(null); // Ref untuk panel sidebar mobile

  const handleLogout = () => {
    console.log("Admin logout...");
    navigate("/login");
  };

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  // Efek untuk menutup dropdown/sidebar saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isAdminNotificationsOpen &&
        adminNotificationPanelRef.current &&
        !adminNotificationPanelRef.current.contains(event.target) &&
        adminNotificationButtonRef.current &&
        !adminNotificationButtonRef.current.contains(event.target)
      ) {
        setIsAdminNotificationsOpen(false);
      }
      // Untuk mobile sidebar, overlay yang akan handle close, atau link di dalamnya
      if (
        isMobileSidebarOpen &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target) &&
        event.target.closest('[data-testid="mobile-burger-button"]') === null
      ) {
        // Cek agar tidak tertutup jika klik tombol burger lagi
        // setIsMobileSidebarOpen(false); // Overlay lebih baik untuk ini
      }
    };
    if (isAdminNotificationsOpen || isMobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAdminNotificationsOpen, isMobileSidebarOpen]);

  // Tutup mobile sidebar saat path berubah
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          {" "}
          {/* Padding konsisten */}
          <div className="flex items-center justify-between h-14 sm:h-16">
            {" "}
            {/* Tinggi header sedikit disesuaikan */}
            <div className="flex items-center">
              <button
                data-testid="mobile-burger-button"
                className="lg:hidden mr-2 text-slate-300 hover:text-white p-1.5 -ml-1.5" // Padding & margin disesuaikan
                onClick={toggleMobileSidebar}
                aria-label="Buka menu navigasi"
              >
                {isMobileSidebarOpen ? (
                  <CloseIcon size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-lg sm:text-xl font-semibold"
              >
                {" "}
                {/* Ukuran font disesuaikan */}
                <Shield
                  size={24}
                  sm={28}
                  className="text-sky-400 flex-shrink-0"
                />
                <span className="hidden xxs:inline xs:inline sm:inline">
                  Admin Panel
                </span>{" "}
                {/* Tampil di layar sangat kecil juga */}
              </Link>
            </div>
            <div className="flex items-center space-x-2.5 sm:space-x-4">
              <div className="relative">
                <button
                  ref={adminNotificationButtonRef}
                  onClick={() => setIsAdminNotificationsOpen((p) => !p)}
                  className="p-1.5 rounded-full hover:bg-slate-700 focus:outline-none relative"
                >
                  <Bell size={20} sm={22} />
                  {/* Indikator notifikasi (jika ada unread) */}
                </button>
                {isAdminNotificationsOpen && (
                  <div
                    ref={adminNotificationPanelRef}
                    className="absolute top-12 sm:top-14 right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg border text-gray-800 z-50"
                  >
                    {" "}
                    /* ... */{" "}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <img
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border-2 border-sky-400"
                  src={adminAvatarPlaceholder}
                  alt="Admin Avatar"
                />
                <span className="text-xs sm:text-sm font-medium hidden sm:block">
                  {adminName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu (Off-canvas) */}
      {isMobileSidebarOpen && (
        <ClientPortal selector="mobile-admin-sidebar-portal">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeMobileSidebar}
          ></div>
          <div
            ref={mobileSidebarRef}
            className={`fixed top-0 left-0 h-full w-60 bg-slate-800 text-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out lg:hidden 
                          ${
                            isMobileSidebarOpen
                              ? "translate-x-0"
                              : "-translate-x-full"
                          }`}
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-2 text-md font-semibold text-sky-400"
                  onClick={closeMobileSidebar}
                >
                  <Shield size={22} />
                  <span>Admin Menu</span>
                </Link>
                <button
                  onClick={closeMobileSidebar}
                  className="text-slate-300 hover:text-white p-1"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
              <nav className="space-y-2 flex-grow">
                {sidebarLinks.map((link) => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== "/admin/dashboard" &&
                      location.pathname.startsWith(link.path + "/"));
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={closeMobileSidebar}
                      className={`group flex items-center w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors 
                                  ${
                                    isActive
                                      ? "bg-sky-600 text-white"
                                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                  }`}
                    >
                      <link.icon
                        size={16}
                        sm={18}
                        className="mr-2.5 sm:mr-3 flex-shrink-0"
                      />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileSidebar();
                  }}
                  className="group flex items-center w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-md text-slate-300 hover:bg-red-700 hover:text-white transition-colors"
                >
                  <LogOut size={16} sm={18} className="mr-2.5 sm:mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Konten Utama */}
      <div className="flex-grow container mx-auto px-2 xxs:px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:flex lg:items-start lg:space-x-6">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg h-full flex flex-col justify-between border border-gray-200 sticky top-[calc(theme(space.16)_+_1.5rem)]">
              {" "}
              {/* Sesuaikan top dengan tinggi header + jarak */}
              <nav className="space-y-1.5">
                <div className="flex items-center justify-center space-x-2 mb-4 pb-3 border-b border-gray-200 pt-1">
                  <div className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700">
                    Logo Dash
                  </div>{" "}
                  {/* Font disesuaikan */}
                </div>
                {sidebarLinks.map((link) => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== "/admin/dashboard" &&
                      location.pathname.startsWith(link.path + "/"));
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`group flex items-center w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors 
                                  ${
                                    isActive
                                      ? "bg-sky-600 text-white shadow-sm"
                                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                  }`}
                    >
                      <link.icon
                        size={16}
                        sm={18}
                        className={`mr-2.5 sm:mr-3 flex-shrink-0 ${
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
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-700 hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                  <LogOut
                    size={16}
                    sm={18}
                    className="mr-2.5 sm:mr-3 text-slate-400 group-hover:text-red-600"
                  />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
