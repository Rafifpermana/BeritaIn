import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, Menu, X, ChevronLeft } from "lucide-react";

import logo2 from "../assets/logo2.png"; // Pastikan path ini benar
import ClientPortal from "../utils/Portal"; // Impor Portal yang baru dibuat (sesuaikan path jika perlu)

const Navbar = () => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const navbarRef = useRef(null);

  const categories = [
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
  ];

  const searchDropdownRef = useRef(null);
  // Ref untuk panel mobile menu dan auth sidebar tidak lagi krusial jika logika klik luar hanya di overlay
  // Namun, bisa tetap ada jika ada kegunaan lain.

  useEffect(() => {
    const HIDE_THRESHOLD_PX = 10;
    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const localLastScrollY = lastScrollYRef.current;
      const navbarHeight = navbarRef.current
        ? navbarRef.current.offsetHeight
        : 0;
      if (currentScrollY < HIDE_THRESHOLD_PX + 5) {
        setShowNavbar(true);
      } else if (
        currentScrollY > localLastScrollY &&
        currentScrollY > (navbarHeight > 0 ? navbarHeight : HIDE_THRESHOLD_PX)
      ) {
        setShowNavbar(false);
      } else if (currentScrollY < localLastScrollY) {
        setShowNavbar(true);
      }
      lastScrollYRef.current = currentScrollY < 0 ? 0 : currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };
    if (isSearchDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchDropdownOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(
        "Searching for:",
        searchQuery,
        "in category:",
        selectedCategory
      );
      setSearchQuery("");
      setIsSearchDropdownOpen(false);
    }
  };

  const searchPlaceholder =
    selectedCategory === "All Categories" || !selectedCategory
      ? "Cari artikel, berita, dan topik..."
      : `Cari di ${selectedCategory}...`;

  return (
    // Navbar utama tetap dengan z-50
    <div
      ref={navbarRef}
      className={`w-full bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ease-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200">
        {/* Mobile Layout (kode tetap sama) */}
        <div className="flex items-center justify-between w-full lg:hidden">
          <button
            className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center">
            <img
              src={logo2}
              alt="Logo BeritaIn"
              className="w-8 h-8 border-2 border-blue-600 rounded-full object-contain"
            />
            <span className="ml-2 text-gray-700 font-semibold text-lg">
              BeritaIn
            </span>
          </Link>
          <button
            className="text-gray-600 p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsAuthSidebarOpen(true)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Layout (kode tetap sama) */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logo2} alt="Logo BeritaIn" className="w-8 h-8" />
            <span className="ml-2 text-gray-700 font-semibold text-xl">
              BeritaIn
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
                {isSearchDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-[51]">
                    <div className="p-2 space-y-1 max-h-72 overflow-y-auto">
                      {["All Categories", ...categories].map(
                        (category, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsSearchDropdownOpen(false);
                            }}
                            className={`block w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                              selectedCategory === category
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {category}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
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

      {/* Mobile Search Bar (kode tetap sama) */}
      <div className="lg:hidden px-4 sm:px-6 py-2.5 bg-gray-50 border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari di BeritaIn..."
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Mobile Category Menu (Full Screen Overlay) - Menggunakan Portal */}
      {isMobileMenuOpen && (
        <ClientPortal selector="mobile-menu-portal">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden" // z-index overlay
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            className={`fixed inset-x-0 top-0 z-[60] p-3 lg:hidden transform transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`} // z-index panel menu
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
                  {["All Categories", ...categories].map((category, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsMobileMenuOpen(false);
                        console.log("Mobile category selected:", category);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Auth Sidebar - Slide from Right - Menggunakan Portal */}
      {isAuthSidebarOpen && (
        <ClientPortal selector="auth-sidebar-portal">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden" // z-index overlay
            onClick={() => setIsAuthSidebarOpen(false)}
          ></div>
          <div
            className={`fixed inset-y-0 right-0 z-[60] w-72 max-w-[80vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
              isAuthSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`} // z-index panel sidebar
          >
            <div className="p-5 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Akun</h2>
                <button
                  onClick={() => setIsAuthSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 flex flex-col">
                <Link
                  to="/login"
                  onClick={() => {
                    setIsAuthSidebarOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => {
                    setIsAuthSidebarOpen(false);
                  }}
                  className="w-full bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium text-center"
                >
                  Sign Up
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-1.5">
                  <button className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Bantuan & Dukungan
                  </button>
                  <button className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Pengaturan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ClientPortal>
      )}

      {/* Click Outside to Close Desktop Category Dropdown (kode tetap sama) */}
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
