// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Search, Menu, X, ChevronLeft } from "lucide-react"; // X sudah diimpor
import ClientPortal from "../utils/Portal"; // Sesuaikan path jika Portal.jsx ada di utils

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
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchDropdownRef = useRef(null);
  const searchInputRef = useRef(null); // Ref untuk input search

  // Sinkronisasi selectedCategory dengan URL (tetap sama)
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (location.pathname === "/") {
      const queryParams = new URLSearchParams(location.search);
      const categorySlugFromQuery = queryParams.get("category");
      if (categorySlugFromQuery) {
        const foundCategory = CATEGORIES_NAVBAR_LIST.find(
          (cat) => createSlug(cat) === categorySlugFromQuery
        );
        if (foundCategory) setSelectedCategory(foundCategory);
        else setSelectedCategory("All Categories");
      } else {
        setSelectedCategory("All Categories");
      }
    } else if (pathParts.length === 3 && pathParts[1] === "category") {
      const slugFromUrl = pathParts[2];
      const foundCategory = CATEGORIES_NAVBAR_LIST.find(
        (cat) => createSlug(cat) === slugFromUrl
      );
      if (foundCategory) setSelectedCategory(foundCategory);
      else setSelectedCategory("All Categories");
    }
  }, [location.pathname, location.search]);

  // useEffect untuk auto-hide navbar (tetap sama)
  useEffect(() => {
    /* ... logika handleScroll ... */
    const HIDE_THRESHOLD_PX = 10;
    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const localLastScrollY = lastScrollYRef.current;
      const navbarHeight = navbarRef.current
        ? navbarRef.current.offsetHeight
        : 0;
      if (currentScrollY < HIDE_THRESHOLD_PX + 5) setShowNavbar(true);
      else if (
        currentScrollY > localLastScrollY &&
        currentScrollY > (navbarHeight > 0 ? navbarHeight : HIDE_THRESHOLD_PX)
      )
        setShowNavbar(false);
      else if (currentScrollY < localLastScrollY) setShowNavbar(true);
      lastScrollYRef.current = currentScrollY < 0 ? 0 : currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect untuk klik di luar dropdown kategori desktop (tetap sama)
  useEffect(() => {
    /* ... logika handleClickOutside dropdown ... */
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      )
        setIsSearchDropdownOpen(false);
    };
    if (isSearchDropdownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchDropdownOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      const categorySlug =
        selectedCategory === "All Categories" || !selectedCategory
          ? ""
          : createSlug(selectedCategory);
      const queryParams = new URLSearchParams();
      queryParams.append("q", trimmedQuery);
      if (categorySlug) queryParams.append("category", categorySlug);
      navigate(`/search?${queryParams.toString()}`);
      // Tidak clear searchQuery di sini agar pengguna lihat apa yang mereka cari di halaman hasil
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSearchDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setSearchQuery(""); // <-- RESET SEARCH QUERY KETIKA KATEGORI DIUBAH

    if (category === "All Categories") {
      navigate("/");
    } else {
      navigate(`/category/${createSlug(category)}`);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus(); // Fokus kembali ke input setelah clear
    }
  };

  const searchPlaceholder =
    selectedCategory === "All Categories" || !selectedCategory
      ? "Cari artikel, berita, dan topik..."
      : `Cari di ${selectedCategory}...`;

  return (
    <div
      ref={navbarRef}
      className={`w-full bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ease-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200">
        {/* Mobile Layout (logo diubah sedikit) */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <button
            className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center">
            {/* Menggunakan span untuk logo seperti di desktop */}
            <span className="text-orange-500 font-bold text-xl">
              Berita<span className="text-blue-600">In</span>
            </span>
          </Link>
          <button
            className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsAuthSidebarOpen(true)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Layout (logo diubah sedikit) */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link to="/" className="flex items-center flex-shrink-0">
            {/* Menggunakan span untuk logo agar konsisten */}
            <span className="text-orange-500 font-bold text-2xl">
              Berita<span className="text-blue-600">In</span>
            </span>
          </Link>
          <div className="flex-1 max-w-3xl mx-auto px-4">
            <div className="flex items-center space-x-2">
              <div className="relative" ref={searchDropdownRef}>
                <button
                  onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                  className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap text-sm"
                >
                  <span className="font-medium truncate max-w-[150px]">
                    {selectedCategory}
                  </span>
                  <ChevronDown className="ml-1.5 w-4 h-4 flex-shrink-0" />
                </button>
                {isSearchDropdownOpen /* ... dropdown kategori ... */ && (
                  <div className="absolute top-full left-0 mt-1 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-[51]">
                    <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
                      {["All Categories", ...CATEGORIES_NAVBAR_LIST].map(
                        (cat, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCategorySelect(cat)}
                            className={`block w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                              selectedCategory === cat
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  ref={searchInputRef} // Tambahkan ref ke input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  // Tambah pr (padding-right) jika ikon X ada, agar teks tidak tertutup ikon X
                  className={`w-full px-4 py-2 ${
                    searchQuery ? "pr-10" : "pr-10"
                  } border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                />
                {/* Tombol Search atau Clear (X) */}
                {searchQuery ? (
                  <button
                    type="button" // type="button" agar tidak submit form
                    onClick={clearSearchQuery}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Clear search query"
                  >
                    <X className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit" // type="submit" untuk ikon search
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </form>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 sm:px-6 py-2.5 bg-gray-50 border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            ref={searchInputRef} // Tambahkan ref juga di sini jika ingin clearSearchQuery berfungsi dari sini juga
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari di BeritaIn..."
            className={`w-full px-4 py-2.5 ${
              searchQuery ? "pr-10" : "pr-10"
            } border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={clearSearchQuery}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {/* Mobile Category Menu (Menggunakan Portal) */}
      {isMobileMenuOpen && (
        <ClientPortal selector="mobile-menu-portal">
          {/* ... Konten MobileCategoryMenu tetap sama, pastikan onClick memanggil handleCategorySelect ... */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            className={`fixed inset-x-0 top-0 z-[60] p-3 lg:hidden transform transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="bg-white rounded-xl shadow-xl max-h-[85vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-md font-semibold text-gray-900">
                  Kategori
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 overflow-y-auto">
                <div className="space-y-1.5">
                  {["All Categories", ...CATEGORIES_NAVBAR_LIST].map(
                    (cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${
                          selectedCategory === cat
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Auth Sidebar (Menggunakan Portal) (kode tetap sama) */}
      {isAuthSidebarOpen && (
        <ClientPortal selector="auth-sidebar-portal">
          {" "}
          {/* ... Konten Auth Sidebar ... */}{" "}
        </ClientPortal>
      )}

      {/* Click Outside untuk Desktop Category Dropdown (kode tetap sama) */}
      {isSearchDropdownOpen && !isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[49]"
          onClick={() => setIsSearchDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
