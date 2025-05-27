// src/pages/HomePage.jsx
import React from "react";

// Komponen untuk judul bagian dengan garis vertikal (sudah ada dari bagian sebelumnya)
const SectionTitle = ({ title }) => (
  <div className="flex items-center mb-4 md:mb-6">
    <span className="w-1 h-6 bg-black mr-3"></span>{" "}
    {/* Sesuaikan warna jika perlu */}
    <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
  </div>
);

const HomePage = () => {
  // Data dari bagian pertama
  const popularPosts = [
    {
      title: "AI Breakthrough: Machines Now Write Poetry?",
      author: "Alex Johnson",
      date: "Jan 13, 2025",
      image: "/placeholder-ai.jpg",
      link: "#",
    },
    {
      title: "The Future of Remote Work in 2025",
      author: "Emily Carter",
      date: "Jan 10, 2025",
      image: "/placeholder-remote.jpg",
      link: "#",
    },
    {
      title: "The Truth About Social Media Algorithms",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/placeholder-social.jpg",
      link: "#",
    },
    {
      title: "The Future of Work: Are Offices a Thing of the Past?",
      author: "Michael Torres",
      date: "Jan 13, 2025",
      image: "/placeholder-office.jpg",
      link: "#",
    },
  ];

  // Data untuk bagian kedua
  const recommendationNewsData = [
    {
      title: "Fitness Trends That Will Dominate This Year!",
      author: "John Smith",
      date: "Jan 10, 2025",
      link: "#",
    },
    {
      title: "How Gen Z is Changing the Workplace Forever",
      author: "Ryan Cooper",
      date: "Jan 10, 2025",
      link: "#",
    },
    {
      title: "Gaming Industry Shakeup: What's Next for Esports?",
      author: "Luke Wilson",
      date: "Dec 22, 2024",
      link: "#",
    },
  ];

  const trendingNowData = [
    {
      title: "Inside the World's Most Advanced Smart Cities",
      author: "Olivia Carter",
      date: "Nov 14, 2024",
      image: "/placeholder-smart-cities.jpg",
      isLarge: true,
      link: "#",
    },
    {
      title: "How Streaming Services Are Changing Entertainment",
      author: "Jason Mitchell",
      date: "Jan 12, 2025",
      image: "/placeholder-streaming.jpg",
      link: "#",
    },
    {
      title: "The Rise of Sustainable Fashion",
      author: "Emily Thompson",
      date: "Jan 18, 2025",
      image: "/placeholder-fashion.jpg",
      link: "#",
    },
    {
      title: "New Space Missions Set to Change Astronomy",
      author: "William Chase",
      date: "Jan 19, 2025",
      image: "/placeholder-space.jpg",
      link: "#",
    },
  ];

  const latestUpdatesData = [
    { title: "Why Electric Vehicles Are Taking Over the Roads", link: "#" },
    { title: "The Secret Behind Viral Social Media Trends", link: "#" },
    { title: "How Esports is Becoming a Billion-Dollar Industry", link: "#" },
    { title: "Breakthroughs in Medical Technology This Year", link: "#" },
    { title: "The Changing Landscape of Remote Work", link: "#" },
    { title: "Why Gen Z is Reshaping the Job Market", link: "#" },
  ];

  // Data untuk bagian ketiga (baru)
  const breakingNewsData = [
    {
      title: "The Dark Side of AI: Ethical Concerns & Risks",
      author: "Anthony Sputo",
      date: "Jan 13, 2024",
      image: "/placeholder-dark-ai.jpg",
      link: "#",
    },
    {
      title: "How Minimalism Is Changing Interior Design",
      author: "Rachel Stevens",
      date: "Jan 13, 2025",
      image: "/placeholder-minimalism.jpg",
      link: "#",
    },
    {
      title: "Hollywood's Biggest Movie Releases This Year",
      author: "Alan Johnson",
      date: "Jan 13, 2025",
      image: "/placeholder-hollywood.jpg",
      link: "#",
    },
    {
      title: "Is Cloud Gaming the Future of Play?",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/placeholder-cloud-gaming.jpg",
      link: "#",
    },
    {
      title: "The Rise of K-Pop: What's Next for the Global Phenomenon?",
      author: "Kim Jae-eun",
      date: "Jan 13, 2025",
      image: "/placeholder-kpop.jpg",
      link: "#",
    },
    {
      title: "The Future of Work: Remote, Hybrid, or Back to Office?",
      author: "Priya S.",
      date: "Jan 13, 2025",
      image: "/placeholder-future-work.jpg",
      link: "#",
    },
  ];

  const tagsCategoryData = [
    "Tech & Innovation",
    "Business & Economy",
    "Entertainment & Pop Culture",
    "Science & Discovery",
    "Health & Wellness",
    "Sports",
    "Gaming",
    "Esports",
    "Virtual Worlds",
    "Travel & Adventure",
    "Politics & Global Affairs",
    "Finance",
    "Cryptocurrency",
    "Lifestyle & Trends",
    "Social Media & Influencers",
    "Education",
    "Environment & Sustainability",
  ];
  const moreTag = "More";

  return (
    <div className="container mx-auto py-8 px-4">
      {/* === BAGIAN PERTAMA === */}
      <div className="grid gap-8 lg:grid-cols-3 mb-12 md:mb-16">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <a href="#" className="block">
              <img
                src="/placeholder-laptop.jpg"
                alt="Mind-Blowing Travel Destinations"
                className="w-full h-auto object-cover hidden md:block"
                style={{ aspectRatio: "1.8 / 1" }}
              />
              <img
                src="/placeholder-laptop-mobile.jpg"
                alt="Mind-Blowing Travel Destinations"
                className="w-full h-auto object-cover md:hidden"
                style={{ aspectRatio: "1.33 / 1" }}
              />
            </a>
          </div>
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl hover:text-blue-600 transition-colors">
              <a href="#">
                Mind-Blowing Travel Destinations You Need to Visit!
              </a>
            </h2>
            <div className="flex items-center mt-2 text-gray-500 text-sm">
              <span>By Muhammad Rafif Permana Putra</span>
              <span className="mx-2">|</span>
              <span>Jan 23, 2025</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-3">
          {popularPosts.map((post, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-3 items-start group"
            >
              <div className="col-span-1 relative rounded-md overflow-hidden">
                <a href={post.link} className="block">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover aspect-[4/3] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[1/1] group-hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm sm:text-base font-semibold group-hover:text-blue-600 transition-colors">
                  <a href={post.link}>{post.title}</a>
                </h3>
                <div className="flex items-center mt-1 text-gray-500 text-xs">
                  <span>By {post.author}</span>
                  <span className="mx-1.5">|</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === BAGIAN KEDUA === */}
      <section className="mb-12 md:mb-16">
        <SectionTitle title="Recommendation News" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recommendationNewsData.map((item, index) => (
            <div key={index} className="group">
              <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                <a href={item.link}>{item.title}</a>
              </h3>
              <div className="text-xs text-gray-500">
                <span>By {item.author}</span>
                <span className="mx-1.5">|</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 md:mb-16">
        {" "}
        {/* Menambah margin bawah */}
        <section className="lg:col-span-2">
          <SectionTitle title="Trending Now" />
          <div className="space-y-6 md:space-y-8">
            {trendingNowData.map((item, index) => (
              <div
                key={index}
                className={`group flex flex-col ${
                  item.isLarge ? "md:flex-row" : "sm:flex-row"
                } gap-4 items-start`}
              >
                <a
                  href={item.link}
                  className={`block relative rounded-md overflow-hidden ${
                    item.isLarge
                      ? "w-full md:w-1/2 lg:w-2/5"
                      : "w-full sm:w-1/3 md:w-1/4 lg:w-1/3"
                  } flex-shrink-0`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full object-cover group-hover:opacity-80 transition-opacity ${
                      item.isLarge
                        ? "aspect-video sm:aspect-[16/9]"
                        : "aspect-video sm:aspect-[4/3]"
                    }`}
                  />
                </a>
                <div
                  className={`${
                    item.isLarge ? "mt-3 md:mt-0" : "mt-2 sm:mt-0"
                  }`}
                >
                  <h3
                    className={`font-semibold group-hover:text-blue-600 transition-colors ${
                      item.isLarge
                        ? "text-xl md:text-2xl"
                        : "text-base md:text-lg"
                    }`}
                  >
                    <a href={item.link}>{item.title}</a>
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>By {item.author}</span>
                    <span className="mx-1.5">|</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionTitle title="Latest Updates" />
          <div className="space-y-3">
            {latestUpdatesData.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="block text-sm sm:text-base font-medium text-gray-700 hover:text-blue-600 hover:underline transition-colors"
              >
                {item.title}
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* --- AWAL BAGIAN KETIGA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Breaking News (takes 2 cols on lg) */}
        <section className="lg:col-span-2">
          <SectionTitle title="Breaking News" />
          <div className="space-y-5 md:space-y-6">
            {breakingNewsData.map((item, index) => (
              <div key={index} className="group flex gap-4 items-start">
                <a
                  href={item.link}
                  className="block w-1/3 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0 rounded-md overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity" // aspect-video atau 16/9 cocok untuk thumbnail
                  />
                </a>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    <a href={item.link}>{item.title}</a>
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>By {item.author}</span>
                    <span className="mx-1.5">|</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tags Category (takes 1 col on lg) */}
        <section>
          <SectionTitle title="Tags Category" />
          <div className="flex flex-wrap gap-2">
            {tagsCategoryData.map((tag, index) => (
              <a
                key={index}
                href="#" // Ganti dengan link kategori yang sesuai
                className="bg-gray-200 text-gray-700 text-xs sm:text-sm px-3 py-1.5 rounded-md hover:bg-gray-300 hover:text-black transition-colors"
              >
                {tag}
              </a>
            ))}
            <a
              href="#" // Ganti dengan link ke halaman semua kategori
              className="bg-gray-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md hover:bg-black transition-colors"
            >
              {moreTag}
            </a>
          </div>
        </section>
      </div>
      {/* --- AKHIR BAGIAN KETIGA --- */}
    </div>
  );
};

export default HomePage;
