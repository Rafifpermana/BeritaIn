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
import { useHomeContent } from "../contexts/HomeContentProvider";
import UserAvatar from "./UserAvatar";

// Helper function untuk membuat slug
const createSlug = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Komponen ProfileDropdown (tidak ada perubahan)
const ProfileDropdown = ({ onLogout, isAdmin }) => (
  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50 py-1 animate-in slide-in-from-top-2 duration-200">
    <Link
      to={isAdmin() ? "/admin/dashboard" : "/user/dashboard"}
      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
    >
      <LayoutDashboard size={16} className="mr-3" />
      Dashboard
    </Link>
    <button
      onClick={onLogout}
      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
    >
      <LogOut size={16} className="mr-3" />
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
  const [lastScrollY, setLastScrollY] = useState(0);

  const refs = {
    navbar: useRef(null),
    searchDropdown: useRef(null),
    profileDropdown: useRef(null),
    notificationDropdown: useRef(null),
    searchInput: useRef(null),
    mobileSearchInput: useRef(null),
  };

  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useArticleInteractions();

  const { categories } = useHomeContent();

  // Semua useEffect dan fungsi handler (handleScroll, handleLogout, dll.) tetap sama
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  const recentNotifications = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
    .slice(0, 5);

  return (
    <div
      ref={refs.navbar}
      className={`w-full bg-white shadow-sm sticky top-0 z-40 transition-transform duration-300 ease-in-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
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
                  className="flex items-center pl-4 pr-2 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/60 rounded-l-full transition-colors"
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
                  <div className="absolute top-full left-0 mt-2 w-60 bg-white border rounded-lg shadow-xl z-10 max-h-72 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                    {[
                      "All Categories",
                      ...categories.map((cat) => cat.name),
                    ].map((catName) => (
                      <button
                        key={catName}
                        type="button"
                        onClick={() => handleCategorySelect(catName)}
                        className={`block w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
                          selectedCategory === catName
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {catName}
                      </button>
                    ))}
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
                      className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
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
        <div className="flex items-center justify-end space-x-4">
          {currentUser ? (
            <>
              {/* Notifications */}
              <div className="relative" ref={refs.notificationDropdown}>
                <button
                  onClick={() => setIsNotificationDropdownOpen((p) => !p)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none relative transition-colors"
                  aria-label="Notifikasi"
                >
                  <Bell size={22} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 p-0.5 transform -translate-y-0.5 translate-x-0.5 rounded-full bg-red-500 ring-1 ring-white animate-pulse"></span>
                  )}
                </button>
                {isNotificationDropdownOpen && (
                  <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 max-w-[75vw] bg-white rounded-lg shadow-xl border z-50 max-h-[80vh] flex flex-col animate-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Notifikasi Terbaru
                      </h3>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={() => {
                            markAllNotificationsAsRead();
                            setIsNotificationDropdownOpen(false);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto flex-grow">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((notif) => (
                          <Link
                            key={notif.id}
                            to={notif.link || "#"}
                            onClick={() => {
                              if (!notif.read) {
                                markNotificationAsRead(notif.id);
                              }
                              setIsNotificationDropdownOpen(false);
                            }}
                            className={`block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                              !notif.read ? "bg-blue-50 border-blue-100" : ""
                            }`}
                          >
                            <p
                              className={`text-xs text-gray-800 mb-0.5 ${
                                !notif.read ? "font-bold" : "font-normal"
                              }`}
                            >
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400">
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
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 p-4 text-center">
                          Tidak ada notifikasi.
                        </p>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-2 border-t border-gray-200 text-center bg-gray-50 rounded-b-lg">
                        <Link
                          to="/user/dashboard/all-notifications"
                          onClick={() => setIsNotificationDropdownOpen(false)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          Lihat Semua Notifikasi
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={refs.profileDropdown}>
                <button
                  onClick={() => setIsProfileDropdownOpen((p) => !p)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <UserAvatar name={currentUser.name} size="w-9 h-9" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
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
                className="hidden sm:flex bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
              <button
                onClick={() => setIsAuthSidebarOpen(true)}
                className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <UserIcon size={20} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 sm:px-6 py-3 border-t bg-gray-50">
        <form
          onSubmit={handleSearchSubmit}
          className="group flex items-center w-full bg-white rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all duration-200 shadow-sm"
        >
          <div className="relative" ref={refs.searchDropdown}>
            <button
              type="button"
              onClick={() => setIsSearchDropdownOpen((p) => !p)}
              className="flex items-center pl-4 pr-2 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-l-full min-w-0 transition-colors"
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
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                {/* Render kategori dari context (untuk mobile) */}
                {["All Categories", ...categories.map((cat) => cat.name)].map(
                  (catName) => (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => handleCategorySelect(catName)}
                      className={`block w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
                        selectedCategory === catName
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {catName}
                    </button>
                  )
                )}
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
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
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
            className="fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300"
            onClick={() => setIsAuthSidebarOpen(false)}
          ></div>
          <div
            className={`fixed inset-y-0 right-0 z-[60] w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
              isAuthSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Akun</h2>
                <button
                  onClick={() => setIsAuthSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3 flex flex-col">
                <Link
                  to="/login"
                  onClick={() => setIsAuthSidebarOpen(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsAuthSidebarOpen(false)}
                  className="w-full bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center hover:bg-gray-700 transition-colors"
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
