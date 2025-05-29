// src/components/Footer.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Impor Link dan useNavigate
import {
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
  ChevronUp,
  Facebook, // Contoh jika ingin menambahkan ikon Facebook
} from "lucide-react"; // Asumsi X (untuk Twitter baru) sudah ada jika digunakan di Navbar

// Fungsi createSlug (HARUS SAMA DENGAN YANG DI NAVBAR, HOMEPAGE, CATEGORYPAGE)
// Idealnya, impor dari file utilitas bersama.
const createSlug = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Daftar kategori yang sama seperti di Navbar (untuk validasi atau referensi jika diperlukan)
// Ini bisa juga tidak diperlukan di sini jika semua link adalah kategori yang valid.
const CATEGORY_LINKS_IN_FOOTER = [
  // Kategori yang ada di footerData.news, .lifestyle, .topics
  "Sport",
  "Entertainment",
  "Gaming",
  "Politics",
  "Business",
  "Tech",
  "Science",
  "Travel",
  "Lifestyle",
  "Education",
  "Movie",
  "Food & Culinary",
  "Entrepreneurship",
  "Startups",
  "Cryptocurrency",
  "Global Affairs",
  "Local",
  "Experience",
  "Jakarta",
  "SEA",
  "Explore",
];

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const navigate = useNavigate(); // Untuk navigasi jika diperlukan (meskipun Link sudah cukup)

  // footerData tetap sama, kita akan memproses link-nya saat render
  const footerData = {
    about: {
      title: "About",
      links: [
        // Link ini mungkin bukan kategori, jadi href="#" atau path statis
        { name: "About Us", href: "/about-us" }, // Contoh path statis
        { name: "Terms and Condition", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
      ],
      isCategoryLinks: false, // Flag untuk membedakan
    },
    news: {
      title: "News",
      links: CATEGORY_LINKS_IN_FOOTER.slice(0, 7).map((name) => ({
        name,
        isCategory: true,
      })), // Ambil dari list utama
      isCategoryLinks: true,
    },
    lifestyle: {
      title: "Lifestyle",
      links: CATEGORY_LINKS_IN_FOOTER.slice(7, 14).map((name) => ({
        name,
        isCategory: true,
      })),
      isCategoryLinks: true,
    },
    topics: {
      title: "Topics",
      links: CATEGORY_LINKS_IN_FOOTER.slice(14).map((name) => ({
        name,
        isCategory: true,
      })),
      isCategoryLinks: true,
    },
  };

  // Social icons (contoh, bisa ditambahkan Facebook atau X)
  const socialIcons = [
    { Icon: Twitter, href: "https://twitter.com", label: "Twitter" }, // Gunakan X jika Twitter baru
    { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  ];

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const renderFooterLink = (linkItem, index) => {
    if (linkItem.isCategory) {
      return (
        <li key={linkItem.name + index}>
          <Link
            to={`/category/${createSlug(linkItem.name)}`}
            className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
          >
            {linkItem.name}
          </Link>
        </li>
      );
    }
    // Untuk link non-kategori seperti About Us, dll.
    return (
      <li key={linkItem.name + index}>
        <Link
          to={linkItem.href || "#"} // Gunakan href dari data atau fallback ke '#'
          className="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200 block py-1"
        >
          {linkItem.name}
        </Link>
      </li>
    );
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Mobile Accordion Layout (< sm) */}
        <div className="block sm:hidden space-y-1">
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleSection(key)}
                className="flex justify-between items-center w-full py-3 text-left"
              >
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                  {" "}
                  {/* Disesuaikan dengan mobile Navbar */}
                  {section.title}
                </h3>
                {expandedSections[key] ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {expandedSections[key] && (
                <ul className="pt-2 pb-3 space-y-2 pl-3">
                  {" "}
                  {/* Padding disesuaikan */}
                  {section.links.map((linkItem, index) =>
                    renderFooterLink(linkItem, index)
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Tablet & Desktop Layout (sm+) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">
                {" "}
                {/* Font lebih kecil untuk judul kolom */}
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {" "}
                {/* Jarak antar link */}
                {section.links.map((linkItem, index) =>
                  renderFooterLink(linkItem, index)
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media, Nama Anda, dan Copyright Section */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank" // Buka di tab baru
                  rel="noopener noreferrer" // Keamanan untuk target="_blank"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Didesain oleh{" "}
                <span className="font-semibold "> Rafifpermana</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
