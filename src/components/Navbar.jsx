// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Bell,
  User as UserIcon,
} from "lucide-react";
import ClientPortal from "../utils/Portal";
import { useAuth } from "../contexts/AuthContext";
import { useArticleInteractions } from "../hooks/useArticleInteractions";

const createSlug = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const CATEGORIES_NAVBAR_LIST = [
  "Tech & Innovation",
  "Business & Economy",
  "Entertainment & Pop Culture",
  "Science & Discovery",
  "Health & Wellness",
  "Sports",
  "Gaming",
  "Esport",
  "Travel & Adventure",
  "Politics & Global Affairs",
  "Cryptocurrency",
  "Education",
  "Environment & Sustainability",
  "Lifestyle & Trends",
];

const Navbar = () => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);

  const refs = {
    navbar: useRef(null),
    searchDropdown: useRef(null),
    profileDropdown: useRef(null),
    notificationDropdown: useRef(null),
    searchInput: useRef(null),
    lastScrollY: useRef(0),
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isAdmin } = useAuth();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useArticleInteractions();

  // Efek auto-hide navbar
  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(
        window.scrollY < refs.lastScrollY.current || window.scrollY < 50
      );
      refs.lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refs.searchDropdown.current &&
        !refs.searchDropdown.current.contains(event.target)
      )
        setIsSearchDropdownOpen(false);
      if (
        refs.profileDropdown.current &&
        !refs.profileDropdown.current.contains(event.target)
      )
        setIsProfileDropdownOpen(false);
      if (
        refs.notificationDropdown.current &&
        !refs.notificationDropdown.current.contains(event.target)
      )
        setIsNotificationDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs]);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const params = new URLSearchParams({ q: trimmedQuery });
      if (selectedCategory !== "All Categories") {
        params.append("category", createSlug(selectedCategory));
      }
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSearchDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(
      category === "All Categories" ? "/" : `/category/${createSlug(category)}`
    );
  };

  const searchPlaceholder = `Cari di ${selectedCategory}...`;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div
      ref={refs.navbar}
      className={`w-full bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
        {/* Mobile Left */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2"
          >
            <Menu />
          </button>
        </div>
        {/* Logo */}
        <Link
          to="/"
          className="text-orange-500 font-bold text-2xl lg:flex-shrink-0"
        >
          Berita<span className="text-blue-600">In</span>
        </Link>
        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-3xl mx-auto px-4">
          <div className="relative" ref={refs.searchDropdown}>
            <button
              onClick={() => setIsSearchDropdownOpen((p) => !p)}
              className="flex items-center px-3 py-2 bg-gray-100 rounded-l-md hover:bg-gray-200 text-sm"
            >
              <span className="font-medium truncate max-w-[150px]">
                {selectedCategory}
              </span>
              <ChevronDown className="ml-1.5 w-4 h-4" />
            </button>
            {isSearchDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-[51] max-h-72 overflow-y-auto">
                {["All Categories", ...CATEGORIES_NAVBAR_LIST].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`block w-full text-left px-3 py-2 text-sm ${
                      selectedCategory === cat
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              ref={refs.searchInput}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-4 py-2 border-y border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
        {/* Auth / Profile Section */}
        <div className="flex items-center space-x-2 lg:flex-shrink-0">
          {currentUser ? (
            <>
              <div className="relative" ref={refs.notificationDropdown}>
                <button
                  onClick={() => setIsNotificationDropdownOpen((p) => !p)}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                >
                  <Bell size={22} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>
                {isNotificationDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-[80vh] flex flex-col">
                    <div className="flex justify-between items-center p-3 border-b">
                      <h3 className="text-sm font-semibold">Notifikasi</h3>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((n) => (
                          <Link
                            key={n.id}
                            to={n.link || "#"}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              setIsNotificationDropdownOpen(false);
                            }}
                            className={`block p-3 hover:bg-gray-50 border-b last:border-b-0 ${
                              !n.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <p
                              className={`text-xs ${
                                !n.read
                                  ? "font-semibold text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {n.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(n.timestamp).toLocaleString("id-ID")}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <p className="p-4 text-xs text-center text-gray-500">
                          Tidak ada notifikasi baru.
                        </p>
                      )}
                    </div>
                    <div className="p-2 border-t text-center">
                      <Link
                        to="/user/dashboard/all-notifications"
                        onClick={() => setIsNotificationDropdownOpen(false)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Lihat Semua Notifikasi
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={refs.profileDropdown}>
                <button
                  onClick={() => setIsProfileDropdownOpen((p) => !p)}
                  className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100"
                >
                  <img
                    src={currentUser.avatarUrl || "/placeholder-avatar.png"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl border z-50 py-1">
                    <Link
                      to={isAdmin() ? "/admin/dashboard" : "/user/dashboard"}
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LayoutDashboard size={16} className="mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="lg:hidden">
                <button
                  onClick={() => setIsAuthSidebarOpen(true)}
                  className="p-2 -mr-2"
                >
                  <UserIcon />
                </button>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 sm:px-6 py-2.5 bg-gray-50 border-b">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel, berita, dan topik..."
            className="w-full px-4 py-2.5 pr-10 border rounded-lg text-sm"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* --- PORTALS UNTUK MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <ClientPortal selector="mobile-menu-portal">
          <div
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            className="fixed inset-x-0 top-0 z-[60] p-3 lg:hidden transform transition-transform duration-300"
            style={{
              transform: isMobileMenuOpen
                ? "translateY(0)"
                : "translateY(-100%)",
            }}
          >
            <div className="bg-white rounded-xl shadow-xl max-h-[85vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-md font-semibold">Kategori</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 overflow-y-auto">
                {["All Categories", ...CATEGORIES_NAVBAR_LIST].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg ${
                      selectedCategory === cat
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {isAuthSidebarOpen && (
        <ClientPortal selector="auth-sidebar-portal">
          <div
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
            onClick={() => setIsAuthSidebarOpen(false)}
          ></div>
          <div
            className={`fixed inset-y-0 right-0 z-[60] w-72 max-w-[80vw] bg-white shadow-2xl transform transition-transform duration-300 lg:hidden ${
              isAuthSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-5 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Akun</h2>
                <button
                  onClick={() => setIsAuthSidebarOpen(false)}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 flex flex-col">
                <Link
                  to="/login"
                  onClick={() => setIsAuthSidebarOpen(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsAuthSidebarOpen(false)}
                  className="w-full bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}
    </div>
  );
};

export default Navbar;
