import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, Menu, X, ChevronLeft } from "lucide-react";

import logo2 from "../assets/logo2.png";

const Navbar = () => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

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
    }
  };

  // Placeholder dinamis
  const searchPlaceholder =
    selectedCategory === "All Categories" || !selectedCategory
      ? "Search articles, news, and topics..."
      : `Search in ${selectedCategory}...`;

  return (
    <div className="w-full bg-white shadow-sm">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200">
        {/* Mobile Layout: Hamburger + Logo + ChevronLeft */}
        <div className="flex items-center justify-between w-full lg:hidden">
          {/* Hamburger Menu */}
          <button
            className="text-gray-600 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo - Center on Mobile */}
          <div className="flex items-center">
            <img
              src={logo2}
              alt="Logo"
              className="w-8 h-8 border-2 border-blue-600 rounded-full object-contain"
            />
            <span className="ml-2 text-gray-600 font-semibold text-lg">
              BeritaIn
            </span>
          </div>

          {/* Auth Sidebar Trigger */}
          <button
            className="text-gray-600 p-2"
            onClick={() => setIsAuthSidebarOpen(true)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Layout: Logo + Search + Auth */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Logo (Left) */}
          <div className="flex items-center">
            <img src={logo2} alt="Logo" className="w-8 h-8 " />
          </div>

          {/* Search Area - Center */}
          <div className="flex-1 max-w-4xl mx-8">
            <div className="flex items-center space-x-3">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                  className="flex items-center px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  <span className="text-sm font-medium">
                    {selectedCategory}
                  </span>
                  <ChevronDown className="ml-2 w-4 h-4 flex-shrink-0" />
                </button>

                {/* Category Dropdown Menu */}
                {isSearchDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
                      {["All Categories", ...categories].map(
                        (category, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsSearchDropdownOpen(false);
                            }}
                            className={`block w-full px-4 py-3 text-sm text-left rounded-md transition-colors ${
                              selectedCategory === category
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
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

              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit(e);
                    }
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Auth Buttons (Right) */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar - Below Navbar */}
      <div className="lg:hidden px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit(e);
              }
            }}
            placeholder={searchPlaceholder}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <button
            onClick={handleSearchSubmit}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Category Menu (Full Screen Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 lg:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-md max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Categories
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category List */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {["All Categories", ...categories].map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-50 text-blue-700 font-medium border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Sidebar - Slide from Right */}
      {isAuthSidebarOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden">
          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Account</h2>
              <button
                onClick={() => setIsAuthSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-4 flex flex-col ">
              <Link
                to="/login"
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium text-center"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full bg-gray-600 text-white px-6 py-4 rounded-xl hover:bg-gray-700 transition-colors text-lg font-medium text-center"
              >
                Sign Up
              </Link>
            </div>

            {/* Additional Options */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Help & Support
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click Outside to Close Dropdown (Desktop Only) */}
      {isSearchDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchDropdownOpen(false)}
        />
      )}

      {/* Click Outside to Close Mobile Menus */}
      {(isMobileMenuOpen || isAuthSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsAuthSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
