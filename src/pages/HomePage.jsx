import React from "react";
import { Link } from "react-router-dom"; // Import Link

// Komponen untuk judul bagian dengan garis vertikal
const SectionTitle = ({ title }) => (
  <div className="flex items-center mb-4 md:mb-6">
    <span className="w-1 h-6 bg-black mr-3"></span>
    <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
  </div>
);

// Komponen untuk item berita kecil dengan thumbnail
const SmallStoryItem = ({ image, title, author, date, link }) => (
  <div className="group flex gap-3 sm:gap-4 items-start">
    <Link
      to={link}
      className="block w-1/3 sm:w-1/4 md:w-1/3 lg:w-1/4 flex-shrink-0 rounded-md overflow-hidden"
    >
      <img
        src={image}
        alt={title}
        className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
      />
    </Link>
    <div>
      <h4 className="text-sm sm:text-base font-semibold group-hover:text-blue-600 transition-colors">
        <Link to={link}>{title}</Link>
      </h4>
      <div className="text-xs text-gray-500 mt-1">
        <span>By {author}</span>
        <span className="mx-1.5">|</span>
        <span>{date}</span>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  // Menambahkan 'id' unik untuk setiap artikel agar bisa di-link
  const popularPosts = [
    {
      id: "ai-poetry",
      title: "AI Breakthrough: Machines Now Write Poetry?",
      author: "Alex Johnson",
      date: "Jan 13, 2025",
      image: "/placeholder-ai.jpg",
    },
    {
      id: "remote-work-2025",
      title: "The Future of Remote Work in 2025",
      author: "Emily Carter",
      date: "Jan 10, 2025",
      image: "/placeholder-remote.jpg",
    },
    {
      id: "social-media-algo",
      title: "The Truth About Social Media Algorithms",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/placeholder-social.jpg",
    },
    {
      id: "future-of-office",
      title: "The Future of Work: Are Offices a Thing of the Past?",
      author: "Michael Torres",
      date: "Jan 13, 2025",
      image: "/placeholder-office.jpg",
    },
  ];

  const recommendationNewsData = [
    {
      id: "fitness-trends",
      title: "Fitness Trends That Will Dominate This Year!",
      author: "John Smith",
      date: "Jan 10, 2025",
    },
    {
      id: "gen-z-workplace",
      title: "How Gen Z is Changing the Workplace Forever",
      author: "Ryan Cooper",
      date: "Jan 10, 2025",
    },
    {
      id: "esports-shakeup",
      title: "Gaming Industry Shakeup: What's Next for Esports?",
      author: "Luke Wilson",
      date: "Dec 22, 2024",
    },
  ];

  const trendingNowData = [
    {
      id: "smart-cities",
      title: "Inside the World's Most Advanced Smart Cities",
      author: "Olivia Carter",
      date: "Nov 14, 2024",
      image: "/placeholder-smart-cities.jpg",
      isLarge: true,
    },
    {
      id: "streaming-entertainment",
      title: "How Streaming Services Are Changing Entertainment",
      author: "Jason Mitchell",
      date: "Jan 12, 2025",
      image: "/placeholder-streaming.jpg",
    },
    {
      id: "sustainable-fashion",
      title: "The Rise of Sustainable Fashion",
      author: "Emily Thompson",
      date: "Jan 18, 2025",
      image: "/placeholder-fashion.jpg",
    },
    {
      id: "space-astronomy",
      title: "New Space Missions Set to Change Astronomy",
      author: "William Chase",
      date: "Jan 19, 2025",
      image: "/placeholder-space.jpg",
    },
  ];

  const latestUpdatesData = [
    {
      id: "electric-vehicles",
      title: "Why Electric Vehicles Are Taking Over the Roads",
    },
    {
      id: "viral-trends",
      title: "The Secret Behind Viral Social Media Trends",
    },
    {
      id: "esports-billion-dollar",
      title: "How Esports is Becoming a Billion-Dollar Industry",
    },
    {
      id: "medical-tech",
      title: "Breakthroughs in Medical Technology This Year",
    },
    {
      id: "remote-work-landscape",
      title: "The Changing Landscape of Remote Work",
    },
    { id: "gen-z-job-market", title: "Why Gen Z is Reshaping the Job Market" },
  ];

  const breakingNewsData = [
    {
      id: "dark-side-ai",
      title: "The Dark Side of AI: Ethical Concerns & Risks",
      author: "Anthony Sputo",
      date: "Jan 13, 2024",
      image: "/placeholder-dark-ai.jpg",
    },
    {
      id: "minimalism-design",
      title: "How Minimalism Is Changing Interior Design",
      author: "Rachel Stevens",
      date: "Jan 13, 2025",
      image: "/placeholder-minimalism.jpg",
    },
    {
      id: "hollywood-releases",
      title: "Hollywood's Biggest Movie Releases This Year",
      author: "Alan Johnson",
      date: "Jan 13, 2025",
      image: "/placeholder-hollywood.jpg",
    },
    {
      id: "cloud-gaming-future",
      title: "Is Cloud Gaming the Future of Play?",
      author: "John Doe",
      date: "Jan 13, 2025",
      image: "/placeholder-cloud-gaming.jpg",
    },
    {
      id: "kpop-phenomenon",
      title: "The Rise of K-Pop: What's Next for the Global Phenomenon?",
      author: "Kim Jae-eun",
      date: "Jan 13, 2025",
      image: "/placeholder-kpop.jpg",
    },
    {
      id: "future-work-model",
      title: "The Future of Work: Remote, Hybrid, or Back to Office?",
      author: "Priya S.",
      date: "Jan 13, 2025",
      image: "/placeholder-future-work.jpg",
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

  const mustReadProminentStoryLeft = {
    id: "trump-panama",
    title:
      "Trump reiterates threat to retake Panama Canal ‘or something very powerful’ will happen if pressures on U.S. increase",
    author: "John Doe",
    date: "Jan 13, 2025",
    imageLarge: "/placeholder-trump-large.jpg",
  };
  const mustReadSmallerStoriesLeft = [
    {
      id: "sa-land",
      title:
        "South Africa denies ‘confiscating land,’ after Trump threatens to cut off aid",
      author: "Jason Mitchell",
      date: "Jan 13, 2025",
      image: "/placeholder-sa.jpg",
    },
    {
      id: "mickey-bergman-book",
      title:
        "Mickey Bergman’s new book looks at true stories of high-stakes hostage negotiations...",
      author: "Emily Thompson",
      date: "Jan 16, 2025",
      image: "/placeholder-book.jpg",
    },
    {
      id: "cerita-malam-minggu",
      title: "Cerita tentang Malam Minggu, LinkedIn, dan Menjaga Anak",
      author: "Robert Chen",
      date: "Jan 16, 2025",
      image: "/placeholder-linkedin.jpg",
    },
  ];
  const mustReadProminentStoryRight = {
    id: "ai-gaming-change",
    title: "How AI is Changing the Way We Game",
    author: "John Doe",
    date: "Jan 13, 2025",
    imageLarge: "/placeholder-ai-game-large.jpg",
  };
  const mustReadSmallerStoriesRight = [
    {
      id: "streaming-services-change",
      title: "How Streaming Services Are Changing Entertainment",
      author: "Jason Mitchell",
      date: "Jan 13, 2025",
      image: "/placeholder-streaming-small.jpg",
    },
    {
      id: "rise-sustainable-fashion",
      title: "The Rise of Sustainable Fashion",
      author: "Emily Thompson",
      date: "Jan 16, 2025",
      image: "/placeholder-fashion-small.jpg",
    },
    {
      id: "new-space-missions",
      title: "New Space Missions Set to Change Astronomy",
      author: "Robert Chen",
      date: "Jan 16, 2025",
      image: "/placeholder-space-small.jpg",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* === BAGIAN PERTAMA === */}
      <div className="grid gap-8 lg:grid-cols-3 mb-12 md:mb-16">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            {/* Ganti dengan ID artikel utama jika ada */}
            <Link to={`/article/main-travel-story`} className="block">
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
            </Link>
          </div>
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-bold md:text-4xl hover:text-blue-600 transition-colors">
              <Link to={`/article/main-travel-story`}>
                Mind-Blowing Travel Destinations You Need to Visit!
              </Link>
            </h2>
            <div className="flex items-center mt-2 text-gray-500 text-sm">
              <span>By Muhammad Rafif Permana Putra</span>
              <span className="mx-2">|</span>
              <span>Jan 23, 2025</span>
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:space-y-3">
          {popularPosts.map((post) => (
            <div
              key={post.id}
              className="grid grid-cols-3 gap-3 items-start group"
            >
              <div className="col-span-1 relative rounded-md overflow-hidden">
                <Link to={`/article/${post.id}`} className="block">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover aspect-[4/3] sm:aspect-[16/9] md:aspect-[4/3] lg:aspect-[1/1] group-hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm sm:text-base font-semibold group-hover:text-blue-600 transition-colors">
                  <Link to={`/article/${post.id}`}>{post.title}</Link>
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
          {recommendationNewsData.map((item) => (
            <div key={item.id} className="group">
              <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                <Link to={`/article/${item.id}`}>{item.title}</Link>
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
        <section className="lg:col-span-2">
          <SectionTitle title="Trending Now" />
          <div className="space-y-6 md:space-y-8">
            {trendingNowData.map((item) => (
              <div
                key={item.id}
                className={`group flex flex-col ${
                  item.isLarge ? "md:flex-row" : "sm:flex-row"
                } gap-4 items-start`}
              >
                <Link
                  to={`/article/${item.id}`}
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
                </Link>
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
                    <Link to={`/article/${item.id}`}>{item.title}</Link>
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
            {latestUpdatesData.map(
              (
                item // Asumsi item ini juga bisa menjadi artikel detail
              ) => (
                <Link
                  key={item.id}
                  to={`/article/${item.id}`}
                  className="block text-sm sm:text-base font-medium text-gray-700 hover:text-blue-600 hover:underline transition-colors"
                >
                  {item.title}
                </Link>
              )
            )}
          </div>
        </section>
      </div>

      {/* === BAGIAN KETIGA === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 md:mb-16">
        <section className="lg:col-span-2">
          <SectionTitle title="Breaking News" />
          <div className="space-y-5 md:space-y-6">
            {breakingNewsData.map((item) => (
              <div key={item.id} className="group flex gap-4 items-start">
                <Link
                  to={`/article/${item.id}`}
                  className="block w-1/3 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0 rounded-md overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-blue-600 transition-colors">
                    <Link to={`/article/${item.id}`}>{item.title}</Link>
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
          <SectionTitle title="Tags Category" />
          <div className="flex flex-wrap gap-2">
            {tagsCategoryData.map((tag, index) => (
              <Link
                key={index}
                to={`/category/${tag
                  .toLowerCase()
                  .replace(/ & /g, "-")
                  .replace(/ /g, "-")}`}
                className="bg-gray-200 text-gray-700 text-xs sm:text-sm px-3 py-1.5 rounded-md hover:bg-gray-300 hover:text-black transition-colors"
              >
                {tag}
              </Link>
            ))}
            <Link
              to="/categories"
              className="bg-gray-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md hover:bg-black transition-colors"
            >
              {moreTag}
            </Link>
          </div>
        </section>
      </div>

      {/* --- BAGIAN KEEMPAT (MUST-READ STORIES) --- */}
      <section>
        <SectionTitle title="Must-Read Stories" />
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
          <div>
            <div className="mb-6 md:mb-8 group">
              <Link
                to={`/article/${mustReadProminentStoryLeft.id}`}
                className="block mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={mustReadProminentStoryLeft.imageLarge}
                  alt={mustReadProminentStoryLeft.title}
                  className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
                />
              </Link>
              <h3 className="text-xl md:text-2xl font-bold group-hover:text-blue-600 transition-colors">
                <Link to={`/article/${mustReadProminentStoryLeft.id}`}>
                  {mustReadProminentStoryLeft.title}
                </Link>
              </h3>
              <div className="text-sm text-gray-500 mt-1.5">
                <span>By {mustReadProminentStoryLeft.author}</span>{" "}
                <span className="mx-2">|</span>{" "}
                <span>{mustReadProminentStoryLeft.date}</span>
              </div>
            </div>
            <div className="space-y-4 md:space-y-5">
              {mustReadSmallerStoriesLeft.map((story) => (
                <SmallStoryItem
                  key={story.id}
                  {...story}
                  link={`/article/${story.id}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="mb-6 md:mb-8 group">
              <Link
                to={`/article/${mustReadProminentStoryRight.id}`}
                className="block mb-3 sm:mb-4 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={mustReadProminentStoryRight.imageLarge}
                  alt={mustReadProminentStoryRight.title}
                  className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
                />
              </Link>
              <h3 className="text-xl md:text-2xl font-bold group-hover:text-blue-600 transition-colors">
                <Link to={`/article/${mustReadProminentStoryRight.id}`}>
                  {mustReadProminentStoryRight.title}
                </Link>
              </h3>
              <div className="text-sm text-gray-500 mt-1.5">
                <span>By {mustReadProminentStoryRight.author}</span>{" "}
                <span className="mx-2">|</span>{" "}
                <span>{mustReadProminentStoryRight.date}</span>
              </div>
            </div>
            <div className="space-y-4 md:space-y-5">
              {mustReadSmallerStoriesRight.map((story) => (
                <SmallStoryItem
                  key={story.id}
                  {...story}
                  link={`/article/${story.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
