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
  ListChecks,
  Menu,
  X,
  Clock,
  Home,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useArticleInteractions } from "../hooks/useArticleInteractions";

const UserDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, loading, updateUserProfile, updatePassword } =
    useAuth();

  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useArticleInteractions();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [showHeader, setShowHeader] = useState(true);
  // const [lastScrollY, setLastScrollY] = useState(0);

  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const mobileSidebarRef = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced scroll handler with smooth transitions
  // useEffect(() => {
  //   // const handleScroll = () => {
  //   //   const currentScrollY = window.scrollY;

  //   //   if (currentScrollY < 50) {
  //   //     setShowHeader(true);
  //   //   } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
  //   //     setShowHeader(false);
  //   //   } else if (currentScrollY < lastScrollY) {
  //   //     setShowHeader(true);
  //   //   }

  //   //   setLastScrollY(currentScrollY);
  //   // };

  //   window.addEventListener("scroll", handleScroll, { passive: true });
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [lastScrollY]);

  const toggleNotifications = () =>
    setIsNotificationsOpen(!isNotificationsOpen);

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);

  const handleMarkAllAsReadAndClose = () => {
    markAllNotificationsAsRead();
    setIsNotificationsOpen(false);
  };

  const handleNotificationItemClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    setIsNotificationsOpen(false);
  };

  const handleMobileLinkClick = () => {
    setIsMobileSidebarOpen(false);
  };

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
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target) &&
        !event.target.closest("[data-mobile-menu-button]")
      ) {
        setIsMobileSidebarOpen(false);
      }
    };
    if (isMobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  const recentNotificationsForDropdown = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
    .slice(0, 5);

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm font-medium text-gray-600 mb-4">
            Pengguna tidak ditemukan. Silakan login kembali.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { name: "Beranda", icon: Home, path: "/" },
    { name: "Pengaturan Akun", icon: LayoutDashboard, path: "/user/dashboard" },
    {
      name: "Artikel Disimpan",
      icon: BookmarkIconLucide,
      path: "/user/dashboard/bookmarks",
    },
    { name: "Informasi Poin", icon: Award, path: "/user/dashboard/points" },
    {
      name: "Panduan Komunitas",
      icon: Info,
      path: "/user/dashboard/guidelines",
    },
    {
      name: "Semua Notifikasi",
      icon: ListChecks,
      path: "/user/dashboard/all-notifications",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div
      className={`bg-white ${
        isMobile ? "h-full" : "p-3 sm:p-4 rounded-xl shadow-md h-full"
      } flex flex-col justify-between`}
    >
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-200"
              src={currentUser.avatarUrl || "/placeholder-avatar.png"}
              alt="User Avatar"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={toggleMobileSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      )}

      <div className={`${isMobile ? "flex-1 p-4" : ""}`}>
        {isMobile && (
          <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 text-blue-700 mb-2">
              <Clock size={16} />
              <span className="text-sm font-medium">Waktu Saat Ini</span>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-800 mb-1">
                {formatTime(currentTime)}
              </p>
              <p className="text-xs text-blue-600">{formatDate(currentTime)}</p>
            </div>
          </div>
        )}

        <nav className="space-y-1.5">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isHomePage = link.path === "/";
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={isMobile ? handleMobileLinkClick : undefined}
                className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]"
                    : isHomePage
                    ? "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:transform hover:scale-[1.01]"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:transform hover:scale-[1.01]"
                }`}
              >
                <link.icon
                  size={18}
                  className={`mr-3 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-white"
                      : isHomePage
                      ? "text-gray-400 group-hover:text-green-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className={`${
          isMobile ? "p-4" : "mt-auto pt-4"
        } border-t border-gray-200`}
      >
        <button
          onClick={() => {
            handleLogout();
            if (isMobile) setIsMobileSidebarOpen(false);
          }}
          className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 transition-all duration-200 hover:transform hover:scale-[1.01]"
        >
          <LogOut
            size={18}
            className="mr-3 text-gray-400 group-hover:text-red-500 transition-colors"
          />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header with hide/show functionality */}
      <header
        className={`bg-white shadow-sm sticky top-0 z-40 transition-transform duration-300 ease-in-out `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <button
                data-mobile-menu-button
                onClick={toggleMobileSidebar}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>

              <div className="flex items-center">
                <Link
                  to="/"
                  className="text-orange-500 font-bold text-xl sm:text-2xl hover:text-orange-600 transition-colors"
                >
                  Berita<span className="text-blue-600">In</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  ref={notificationButtonRef}
                  onClick={toggleNotifications}
                  className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none relative transition-colors"
                  aria-label="Notifikasi"
                >
                  <Bell size={22} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationCount > 9
                        ? "9+"
                        : unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationsOpen && (
                  <div
                    ref={notificationPanelRef}
                    className="absolute top-full right-0 mt-2 w-80 sm:w-96 max-w-[90vw] bg-white rounded-lg shadow-xl border z-50 max-h-[80vh] flex flex-col animate-in slide-in-from-top-2 duration-200"
                  >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Notifikasi Terbaru
                      </h3>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={handleMarkAllAsReadAndClose}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                        >
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>

                    <div className="overflow-y-auto flex-grow">
                      {recentNotificationsForDropdown.length === 0 ? (
                        <div className="text-center py-8">
                          <Bell
                            size={48}
                            className="mx-auto text-gray-300 mb-4"
                          />
                          <p className="text-sm text-gray-500">
                            Tidak ada notifikasi saat ini
                          </p>
                        </div>
                      ) : (
                        recentNotificationsForDropdown.map((notif) => (
                          <Link
                            to={notif.link || "#"}
                            key={notif.id}
                            className={`block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                              !notif.read ? "bg-blue-50 border-blue-100" : ""
                            }`}
                            onClick={() => handleNotificationItemClick(notif)}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  !notif.read ? "bg-blue-500" : "bg-gray-300"
                                }`}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm text-gray-800 mb-1 ${
                                    !notif.read
                                      ? "font-semibold"
                                      : "font-normal"
                                  }`}
                                >
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(notif.timestamp).toLocaleString(
                                    "id-ID",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
                        <Link
                          to="/user/dashboard/all-notifications"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                        >
                          Lihat Semua Notifikasi
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile section - only show on desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200"
                  src={currentUser.avatarUrl || "/placeholder-avatar.png"}
                  alt="User Avatar"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300">
          <div
            ref={mobileSidebarRef}
            className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:flex lg:items-start lg:space-x-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0 mb-6 lg:mb-0 lg:sticky lg:top-20">
            <SidebarContent />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <Outlet
              context={{ currentUser, updateUserProfile, updatePassword }}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
