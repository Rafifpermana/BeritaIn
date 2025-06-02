// src/pages/UserDashboardPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Bookmark as BookmarkIconLucide,
  Info,
  LogOut,
  Bell,
  Award,
} from "lucide-react";

// Data Pengguna Awal (bisa juga dari konteks auth yang lebih global nantinya)
const initialDashboardUserData = {
  username: "ipsum_Larisun",
  email: "ipsum.larisun@example.com", // Diasumsikan email tidak diedit di halaman profil ini
  avatarUrl: "/placeholder-avatar.png", // Ganti dengan path avatar default Anda
  points: 85,
};

const UserDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk data pengguna yang bisa diedit, dikelola di sini
  const [currentUsername, setCurrentUsername] = useState(
    initialDashboardUserData.username
  );
  const [currentAvatar, setCurrentAvatar] = useState(
    initialDashboardUserData.avatarUrl
  );
  const [currentUserPoints, setCurrentUserPoints] = useState(
    initialDashboardUserData.points
  ); // Jika poin juga dikelola di sini

  const sidebarLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/user" }, // Ini akan merender DashboardOverview (Pengaturan Profil)
    {
      name: "Bookmark",
      icon: BookmarkIconLucide,
      path: "/dashboard/user/bookmarks",
    },
    { name: "Poin Saya", icon: Award, path: "/dashboard/user/points" },
    {
      name: "Panduan Komunitas",
      icon: Info,
      path: "/dashboard/user/guidelines",
    },
  ];

  // State Notifikasi
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Komentar Anda pada artikel 'AI Poetry' telah dibalas.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
      link: "/article/ai-poetry#comment-xyz",
    },
    {
      id: 2,
      message: "Artikel baru di kategori 'Tech & Innovation'.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
      link: "/category/tech-and-innovation",
    },
  ]);
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const toggleNotifications = () =>
    setIsNotificationsOpen(!isNotificationsOpen);
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  const handleLogout = () => {
    console.log("Pengguna logout...");
    navigate("/login");
  };

  // Fungsi yang akan diteruskan ke DashboardOverview (Pengaturan Profil) untuk update
  const handleUsernameUpdate = (newUsernameValue) => {
    setCurrentUsername(newUsernameValue);
    console.log("Username diupdate di UserDashboardPage:", newUsernameValue);
    // TODO: Panggil API untuk simpan ke backend
  };

  const handleAvatarUpdate = (newAvatarDataUrl) => {
    setCurrentAvatar(newAvatarDataUrl);
    console.log("Avatar diupdate di UserDashboardPage");
    // TODO: Panggil API untuk unggah dan simpan avatar ke backend
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Logo Utama
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  ref={notificationButtonRef}
                  onClick={toggleNotifications}
                  className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none relative"
                  aria-label="Notifikasi"
                >
                  <Bell size={22} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white"></span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div
                    ref={notificationPanelRef}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] flex flex-col"
                  >
                    <div className="flex justify-between items-center p-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Notifikasi
                      </h3>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto flex-grow">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 p-4 text-center">
                          Tidak ada notifikasi.
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <Link
                            to={notif.link || "#"}
                            key={notif.id}
                            className={`block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                              !notif.read ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setIsNotificationsOpen(false)}
                          >
                            <p
                              className={`text-xs text-gray-800 mb-0.5 ${
                                !notif.read ? "font-semibold" : "font-normal"
                              }`}
                            >
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(notif.timestamp).toLocaleTimeString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </Link>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-2 border-t border-gray-200 text-center">
                        <Link
                          to="/dashboard/user/notifications/all"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Lihat Semua Notifikasi
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={currentAvatar}
                  alt="User Avatar"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {currentUsername}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-gray-100 pt-4 pb-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-600 uppercase tracking-wider">
            Dashboard User
          </h1>
        </div>
      </div>
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:flex lg:items-start lg:space-x-6">
          <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0 mb-6 lg:mb-0">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-gray-200">
                  <div className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                    Logo Dash
                  </div>
                </div>
                <nav className="space-y-1.5">
                  {sidebarLinks.map((link) => {
                    const isActive =
                      location.pathname === link.path ||
                      (link.path !== "/dashboard/user" &&
                        location.pathname.startsWith(link.path));
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <link.icon
                          size={18}
                          className={`mr-3 flex-shrink-0 ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 ease-in-out"
                >
                  <LogOut
                    size={18}
                    className="mr-3 text-gray-400 group-hover:text-red-500"
                  />
                  Logout
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 min-w-0">
            <Outlet
              context={{
                // Data yang diteruskan ke child routes (DashboardOverview, UserPointsPage, dll.)
                currentUsername,
                currentAvatar,
                onUsernameUpdate: handleUsernameUpdate,
                onAvatarUpdate: handleAvatarUpdate,
                currentUserEmail: initialDashboardUserData.email,
                currentUserPoints,
              }}
            />
          </main>
        </div>
      </div>
    </div>
  );
};
export default UserDashboardPage;
