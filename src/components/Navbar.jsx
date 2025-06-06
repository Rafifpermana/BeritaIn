// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Search,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Bell,
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

const ProfileDropdown = ({ onLogout, isAdmin }) => (
  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl border z-50 py-1">
    <Link
      to={isAdmin() ? "/admin/dashboard" : "/user/dashboard"}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      <LayoutDashboard size={16} className="mr-2" />
      Dashboard
    </Link>
    <button
      onClick={onLogout}
      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
    >
      <LogOut size={16} className="mr-2" />
      Logout
    </button>
  </div>
);

const Navbar = () => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false);
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
    mobileSearchInput: useRef(null),
    lastScrollY: useRef(0),
  };

  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useArticleInteractions();

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(
        window.scrollY < refs.lastScrollY.current || window.scrollY < 50
      );
      refs.lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [refs]);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setIsSearchDropdownOpen(false);
    navigate(
      category === "All Categories" ? "/" : `/category/${createSlug(category)}`
    );
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

  const clearSearchQuery = () => {
    setSearchQuery("");
    refs.searchInput.current?.focus();
    refs.mobileSearchInput.current?.focus();
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-40">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-2">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-orange-500 font-bold text-xl sm:text-2xl"
          >
            Berita<span className="text-blue-600">In</span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <div className="w-full max-w-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="group flex items-center w-full bg-gray-100 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200"
            >
              <div className="relative" ref={refs.searchDropdown}>
                <button
                  type="button"
                  onClick={() => setIsSearchDropdownOpen((p) => !p)}
                  className="flex items-center pl-4 pr-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/60 rounded-l-full"
                >
                  <span className="truncate max-w-[120px]">
                    {selectedCategory}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 ml-1.5 transition-transform duration-200 ${
                      isSearchDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isSearchDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-60 bg-white border rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto">
                    {["All Categories", ...CATEGORIES_NAVBAR_LIST].map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className={`block w-full text-left px-3 py-2 text-sm ${
                            selectedCategory === cat
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
              <span className="h-5 w-px bg-gray-300" aria-hidden="true"></span>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  ref={refs.searchInput}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari di ${selectedCategory}...`}
                  className="block w-full bg-transparent pl-10 pr-10 py-2.5 text-sm text-gray-800 focus:outline-none"
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={clearSearchQuery}
                      className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                      aria-label="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center justify-end space-x-2">
          {currentUser ? (
            <>
              {/* Notifications */}
              <div className="relative" ref={refs.notificationDropdown}>
                <button
                  onClick={() => setIsNotificationDropdownOpen((p) => !p)}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                >
                  <Bell size={20} className="sm:w-5 sm:h-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>
                {isNotificationDropdownOpen && (
                  <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 max-w-[75vw] bg-white rounded-lg shadow-xl border z-50 max-h-[80vh] flex flex-col">
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

              {/* Profile Dropdown */}
              <div className="relative" ref={refs.profileDropdown}>
                <button
                  onClick={() => setIsProfileDropdownOpen((p) => !p)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
                >
                  <img
                    src={currentUser.avatarUrl || "/placeholder-avatar.png"}
                    alt="Avatar"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-600 transition-transform hidden sm:inline ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProfileDropdownOpen && (
                  <ProfileDropdown onLogout={handleLogout} isAdmin={isAdmin} />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="hidden sm:flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium"
              >
                Sign Up
              </Link>
              <button
                onClick={() => setIsAuthSidebarOpen(true)}
                className="sm:hidden p-2 rounded-full hover:bg-gray-100"
              >
                <UserIcon size={20} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 py-3 border-t bg-gray-50">
        <form
          onSubmit={handleSearchSubmit}
          className="group flex items-center w-full bg-white rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 shadow-sm"
        >
          <div className="relative" ref={refs.searchDropdown}>
            <button
              type="button"
              onClick={() => setIsSearchDropdownOpen((p) => !p)}
              className="flex items-center pl-4 pr-2 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-l-full min-w-0"
            >
              <span className="truncate max-w-[70px] sm:max-w-[90px]">
                {selectedCategory}
              </span>
              <ChevronDown
                className={`w-3 h-3 ml-1 flex-shrink-0 transition-transform duration-200 ${
                  isSearchDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSearchDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {["All Categories", ...CATEGORIES_NAVBAR_LIST].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`block w-full text-left px-3 py-2.5 text-sm ${
                      selectedCategory === cat
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="h-4 w-px bg-gray-300" aria-hidden="true"></span>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              ref={refs.mobileSearchInput}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel..."
              className="block w-full bg-transparent pl-9 pr-9 py-2.5 text-sm text-gray-800 focus:outline-none"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  type="button"
                  onClick={clearSearchQuery}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Auth Sidebar for Mobile */}
      {isAuthSidebarOpen && (
        <ClientPortal selector="auth-sidebar-portal">
          <div
            className="fixed inset-0 bg-black/50 z-[55]"
            onClick={() => setIsAuthSidebarOpen(false)}
          ></div>
          <div
            className={`fixed inset-y-0 right-0 z-[60] w-72 max-w-[80vw] bg-white shadow-2xl transform transition-transform duration-300 ${
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
