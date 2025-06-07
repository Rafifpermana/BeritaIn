// src/pages/AdminDashboardPage.jsx
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
  Clock,
  X as CloseIcon,
} from "lucide-react";
import ClientPortal from "../utils/Portal";
import { useAuth } from "../contexts/AuthContext"; // <-- Impor useAuth untuk data dinamis

const AdminDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // <-- Gunakan data dari AuthContext

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const mobileSidebarRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fungsi logout sekarang memanggil fungsi dari context
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

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
      if (
        isMobileSidebarOpen &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target) &&
        event.target.closest('[data-testid="mobile-burger-button"]') === null
      ) {
        closeMobileSidebar();
      }
    };
    if (isAdminNotificationsOpen || isMobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAdminNotificationsOpen, isMobileSidebarOpen]);

  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname]);

  // Pengaman jika data admin belum ada
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-800 text-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <button
                data-testid="mobile-burger-button"
                className="lg:hidden mr-2 text-slate-300 hover:text-white p-1.5 -ml-1.5"
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
                <Shield size={24} className="text-sky-400 flex-shrink-0" />
                <span className="hidden xxs:inline sm:inline font-bold ">
                  Admin <span className="text-orange-500">Berita</span>
                  <span className="text-blue-600">In</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2.5 sm:space-x-4">
              <div className="relative">
                <button
                  ref={adminNotificationButtonRef}
                  onClick={() => setIsAdminNotificationsOpen((p) => !p)}
                  className="p-1.5 rounded-full hover:bg-slate-700 focus:outline-none relative"
                >
                  <Bell size={20} />
                </button>
                {isAdminNotificationsOpen && (
                  <div
                    ref={adminNotificationPanelRef}
                    className="absolute top-12 sm:top-14 right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg border text-gray-800 z-50"
                  >
                    <div className="p-4 text-center">Notifikasi Admin</div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {/* --- Data Admin Dinamis --- */}
                <img
                  className="hidden sm:block h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border-2 border-sky-400"
                  src={currentUser.avatarUrl}
                  alt="Admin Avatar"
                />
                <span className="text-xs sm:text-sm font-medium hidden sm:block">
                  {currentUser.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu (Off-canvas) */}
      {isMobileSidebarOpen && (
        <ClientPortal selector="mobile-admin-sidebar-portal">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={closeMobileSidebar}
          />

          {/* Sidebar */}
          <div
            ref={mobileSidebarRef}
            className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 flex flex-col ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header (avatar + nama + email + close) */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <img
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200"
                  src={currentUser.avatarUrl}
                  alt="Admin Avatar"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-gray-800">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {currentUser.email}
                  </span>
                </div>
              </div>
              <button
                onClick={closeMobileSidebar}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <CloseIcon size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Time Widget */}
            <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mx-4 mt-4">
              <div className="flex items-center space-x-2 text-blue-700 mb-2">
                <Clock size={16} />
                <span className="text-sm font-medium">Waktu Saat Ini</span>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-800 mb-1">
                  {formatTime(currentTime)}
                </p>
                <p className="text-xs text-blue-600">
                  {formatDate(currentTime)}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-1.5">
              {sidebarLinks.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== "/admin/dashboard" &&
                    location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileSidebar}
                    className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-[1.02]"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-[1.01]"
                    }`}
                  >
                    <link.icon
                      size={18}
                      className={`mr-3 flex-shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout at bottom */}
            <div className="mt-auto p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileSidebar();
                }}
                className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 transition-all duration-200 hover:scale-[1.01]"
              >
                <LogOut
                  size={18}
                  className="mr-3 text-gray-400 group-hover:text-red-500"
                />
                Logout
              </button>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Layout Konten Utama */}
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:flex lg:items-start lg:space-x-6">
          <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-xl shadow-lg h-full flex flex-col justify-between border border-gray-200 sticky top-20">
              <nav className="space-y-1.5">
                <div className="flex items-center justify-center mb-4 pb-3 border-b border-gray-200 pt-1">
                  <div className="px-3 py-1.5 text-sm font-medium text-gray-700">
                    Logo Dash
                  </div>
                </div>
                {sidebarLinks.map((link) => {
                  const isActive =
                    location.pathname === link.path ||
                    (link.path !== "/admin/dashboard" &&
                      location.pathname.startsWith(link.path));
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-sky-600 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <link.icon
                        size={18}
                        className={`mr-3 flex-shrink-0 ${
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
                  className="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-red-100 hover:text-red-700"
                >
                  <LogOut
                    size={18}
                    className="mr-3 text-slate-400 group-hover:text-red-600"
                  />
                  Logout
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 min-w-0 mt-6 lg:mt-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
