// src/components/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // <-- Menghapus 'useNavigate' yang tidak perlu
import {
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
  ChevronUp,
  Facebook,
} from "lucide-react";
import { useHomeContent } from "../contexts/HomeContentProvider";

const createSlug = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const { categories } = useHomeContent(); // <-- Mengambil kategori dari context

  // Membuat data footer secara dinamis
  const footerData = {
    about: {
      title: "About",
      links: [
        { name: "About Us", href: "/about-us" },
        { name: "Terms and Condition", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
      ],
    },
    news: {
      title: "News",
      links: categories
        .slice(0, 5)
        .map((cat) => ({ name: cat.name, isCategory: true })),
    },
    lifestyle: {
      title: "Lifestyle",
      links: categories
        .slice(5, 10)
        .map((cat) => ({ name: cat.name, isCategory: true })),
    },
    topics: {
      title: "Topics",
      links: categories
        .slice(10, 15)
        .map((cat) => ({ name: cat.name, isCategory: true })),
    },
  };

  const socialIcons = [
    { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
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
    return (
      <li key={linkItem.name + index}>
        <Link
          to={linkItem.href || "#"}
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
        {/* Mobile Accordion Layout */}
        <div className="block sm:hidden space-y-1">
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleSection(key)}
                className="flex justify-between items-center w-full py-3 text-left"
              >
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
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
                  {section.links.map((linkItem, index) =>
                    renderFooterLink(linkItem, index)
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((linkItem, index) =>
                  renderFooterLink(linkItem, index)
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              {socialIcons.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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
                <span className="font-semibold ">Rafifpermana</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
