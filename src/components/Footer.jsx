import React, { useState } from "react";
import {
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const footerData = {
    about: {
      title: "About",
      links: [
        "About Us",
        "Terms and Condition",
        "Privacy Policy",
        "Cookie Policy",
      ],
    },
    news: {
      title: "News",
      links: [
        "Sport",
        "Entertainment",
        "Gaming",
        "Politics",
        "Business",
        "Tech",
        "Science",
      ],
    },
    lifestyle: {
      title: "Lifestyle",
      links: [
        "Travel",
        "Lifestyle",
        "Education",
        "Movie",
        "Food & Culinary",
        "Entrepreneurship",
        "Startups",
      ],
    },
    topics: {
      title: "Topics",
      links: [
        "Cryptocurrency",
        "Global Affairs",
        "Local",
        "Experience",
        "Jakarta",
        "SEA",
        "Explore",
      ],
    },
  };

  const socialIcons = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Mobile Accordion Layout (< sm) */}
        <div className="block sm:hidden space-y-4">
          {Object.entries(footerData).map(([key, section]) => (
            <div
              key={key}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              {" "}
              {/* Menghilangkan border bawah untuk item terakhir */}
              <button
                onClick={() => toggleSection(key)}
                className="flex justify-between items-center w-full py-3 text-left"
              >
                <h3 className="text-base font-semibold text-gray-900">
                  {section.title}
                </h3>
                {expandedSections[key] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections[key] && (
                <ul className="mt-3 space-y-3 pl-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 block py-1"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Tablet Layout (sm to lg) */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-x-8 gap-y-10">
          {" "}
          {/* Menambah gap-y */}
          {Object.entries(footerData).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop Layout (lg+) */}
        <div className="hidden lg:grid grid-cols-4 gap-x-8 gap-y-10">
          {" "}
          {/* Menambah gap-y */}
          {/* Kolom diambil dari footerData untuk konsistensi */}
          {Object.values(footerData).map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media, Nama Anda, dan Copyright Section */}
        <div className="mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-gray-200">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center text-center md:text-left">
            {/* Grup Ikon Media Sosial dan Nama Anda */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start">
              <div className="flex space-x-5">
                {" "}
                {/* Sedikit menambah spasi antar ikon */}
                {socialIcons.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1.5 hover:bg-gray-100 rounded-full" // Penyesuaian padding dan warna
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <p className="text-sm text-gray-700 font-medium">
                  Rafifpermana
                </p>
              </div>
            </div>

            {/* Copyright Text */}
            <div className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} NamaWebsiteAnda. Hak Cipta
              Dilindungi.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
