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
            <div key={key} className="border-b border-gray-200 pb-4">
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
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-8">
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
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">
              {footerData.about.title}
            </h3>
            <ul className="space-y-4">
              {footerData.about.links.map((link, index) => (
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

          {/* News Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">
              {footerData.news.title}
            </h3>
            <ul className="space-y-4">
              {footerData.news.links.map((link, index) => (
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

          {/* Lifestyle Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">
              {footerData.lifestyle.title}
            </h3>
            <ul className="space-y-4">
              {footerData.lifestyle.links.map((link, index) => (
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

          {/* Topics Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-6">
              {footerData.topics.title}
            </h3>
            <ul className="space-y-4">
              {footerData.topics.links.map((link, index) => (
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
        </div>

        {/* Social Media and Copyright Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            {/* Social Media Icons */}
            <div className="flex justify-center sm:justify-start space-x-6">
              {socialIcons.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Additional Mobile Footer Info */}
          <div className="mt-6 pt-6 border-t border-gray-100 sm:hidden">
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Stay connected with us for the latest updates
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-600">
                <a href="#" className="hover:text-gray-900">
                  Contact
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-900">
                  Support
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-900">
                  Feedback
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
