// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import ArticleCardStats from "../utils/ArticleCardStats";
import {
  allArticlesData,
  initialCommentsData,
  calculateTotalComments,
} from "../data/mockData";
import { MessageSquare } from "lucide-react";

// Fungsi createSlug (jika belum diimpor dari utils, bisa didefinisikan di sini atau di atas HomePage)
// Idealnya, ini ada di file utils terpisah dan diimpor
const createSlug = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const SectionTitle = ({ title }) => (
  <div className="flex items-center mb-3 md:mb-5">
    <span className="w-1 h-5 sm:h-6 bg-black mr-2 sm:mr-3"></span>
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h2>
  </div>
);

const SmallStoryItem = ({ image, title, author, date, link }) => (
  <div className="group flex gap-3 items-start">
    <Link
      to={link}
      className="block w-1/3 sm:w-1/4 flex-shrink-0 rounded-md overflow-hidden"
    >
      <img
        src={image || "/placeholder-image.jpg"}
        alt={title}
        className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
      />
    </Link>
    <div>
      <h4 className="text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-none">
        <Link to={link}>{title}</Link>
      </h4>
      <div className="text-xs text-gray-500 mt-1">
        <span>By {author}</span>
        <span className="mx-1.5">|</span>
        <span>
          {new Date(date).toLocaleDateString("id-ID", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const popularPostIds = [
    "ai-poetry",
    "remote-work-2025",
    "social-media-algo",
    "future-of-office",
  ];
  const recommendationNewsIds = [
    "fitness-trends",
    "gen-z-workplace",
    "esports-shakeup",
  ];
  const trendingNowIds = [
    "smart-cities",
    "streaming-entertainment",
    "sustainable-fashion",
    "space-astronomy",
  ];
  const latestUpdatesIds = [
    "electric-vehicles",
    "viral-trends",
    "esports-billion-dollar",
    "medical-tech",
    "remote-work-landscape",
    "gen-z-job-market",
  ];
  const breakingNewsIds = [
    "dark-side-ai",
    "minimalism-design",
    "hollywood-releases",
    "cloud-gaming-future",
    "kpop-phenomenon",
    "future-work-model",
  ];
  const mustReadProminentStoryLeftId = "trump-panama";
  const mustReadSmallerStoriesLeftIds = [
    "sa-land",
    "mickey-bergman-book",
    "cerita-malam-minggu",
  ];
  const mustReadProminentStoryRightId = "ai-gaming-change";
  const mustReadSmallerStoriesRightIds = [
    "streaming-services-change",
    "rise-sustainable-fashion",
    "new-space-missions",
  ];
  const mainTravelStoryId = "main-travel-story";

  const getArticle = (id) => allArticlesData[id];
  const getCommentCountForArticle = (id) =>
    calculateTotalComments(initialCommentsData[id] || []);

  const tagsCategoryData = [
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
  const moreTag = "More";
  const mainTravelArticle = getArticle(mainTravelStoryId);

  return (
    <div className="container mx-auto py-6 px-4 sm:py-8">
      {/* === BAGIAN PERTAMA === */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8 sm:mb-10 md:mb-12">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {mainTravelArticle && (
            <>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Link to={`/article/${mainTravelArticle.id}`} className="block">
                  <img
                    src={mainTravelArticle.image || "/placeholder-laptop.jpg"}
                    alt={mainTravelArticle.title}
                    className="w-full h-auto object-cover hidden md:block"
                    style={{ aspectRatio: "1.8 / 1" }}
                  />
                  <img
                    src={
                      mainTravelArticle.image ||
                      "/placeholder-laptop-mobile.jpg"
                    }
                    alt={mainTravelArticle.title}
                    className="w-full h-auto object-cover md:hidden aspect-[4/3] sm:aspect-video"
                  />
                </Link>
              </div>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold hover:text-blue-600 transition-colors leading-tight">
                  <Link to={`/article/${mainTravelArticle.id}`}>
                    {mainTravelArticle.title}
                  </Link>
                </h2>
                <div className="flex items-center mt-1.5 text-gray-500 text-xs sm:text-sm">
                  <span>By {mainTravelArticle.author}</span>
                  <span className="mx-2">|</span>
                  <span>
                    {new Date(mainTravelArticle.date).toLocaleDateString(
                      "id-ID",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                </div>
                <ArticleCardStats
                  likes={mainTravelArticle.initialLikes}
                  dislikes={mainTravelArticle.initialDislikes}
                  commentCount={getCommentCountForArticle(mainTravelArticle.id)}
                  articleId={mainTravelArticle.id}
                />
              </div>
            </>
          )}
        </div>
        <div className="space-y-3 sm:space-y-4 lg:space-y-3">
          {popularPostIds
            .map((id) => getArticle(id))
            .filter(Boolean)
            .map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-3 gap-2.5 sm:gap-3 items-start group"
              >
                <div className="col-span-1 relative rounded-md overflow-hidden">
                  <Link to={`/article/${post.id}`} className="block">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover aspect-[4/3] group-hover:opacity-80 transition-opacity"
                    />
                  </Link>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-3">
                    <Link to={`/article/${post.id}`}>{post.title}</Link>
                  </h3>
                  <div className="flex items-center mt-1 text-gray-500 text-xs">
                    <span>By {post.author}</span>
                    <span className="mx-1.5">|</span>
                    <span>
                      {new Date(post.date).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <ArticleCardStats
                    likes={post.initialLikes}
                    dislikes={post.initialDislikes}
                    commentCount={getCommentCountForArticle(post.id)}
                    articleId={post.id}
                    small
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* === BAGIAN KEDUA === */}
      <section className="mb-8 sm:mb-10 md:mb-12">
        <SectionTitle title="Recommendation News" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {recommendationNewsIds
            .map((id) => getArticle(id))
            .filter(Boolean)
            .map((item) => (
              <div key={item.id} className="group">
                <h3 className="text-base sm:text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                  <Link to={`/article/${item.id}`}>{item.title}</Link>
                </h3>
                <div className="text-xs text-gray-500">
                  <span>By {item.author}</span>
                  <span className="mx-1.5">|</span>
                  <span>
                    {new Date(item.date).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <ArticleCardStats
                  likes={item.initialLikes}
                  dislikes={item.initialDislikes}
                  commentCount={getCommentCountForArticle(item.id)}
                  articleId={item.id}
                  small
                />
              </div>
            ))}
        </div>
      </section>

      {/* === BAGIAN TRENDING NOW & LATEST UPDATES === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
        <section className="lg:col-span-2">
          <SectionTitle title="Trending Now" />
          <div className="space-y-5 md:space-y-6">
            {trendingNowIds
              .map((id) => getArticle(id))
              .filter(Boolean)
              .map((item) => (
                <div
                  key={item.id}
                  className={`group flex flex-col ${
                    item.image && item.isLarge
                      ? "md:flex-row"
                      : item.image
                      ? "sm:flex-row"
                      : ""
                  } gap-3 sm:gap-4 items-start`}
                >
                  {item.image && (
                    <Link
                      to={`/article/${item.id}`}
                      className={`block relative rounded-md overflow-hidden ${
                        item.isLarge
                          ? "w-full sm:w-2/5 md:w-1/2 lg:w-2/5"
                          : "w-full sm:w-1/3"
                      } flex-shrink-0`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`w-full object-cover group-hover:opacity-80 transition-opacity ${
                          item.isLarge
                            ? "aspect-video"
                            : "aspect-[4/3] sm:aspect-video"
                        }`}
                      />
                    </Link>
                  )}
                  <div
                    className={`${
                      item.image && item.isLarge
                        ? "mt-2 sm:mt-0"
                        : item.image
                        ? "mt-2 sm:mt-0"
                        : ""
                    }`}
                  >
                    <h3
                      className={`font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-none ${
                        item.isLarge
                          ? "text-lg sm:text-xl md:text-2xl"
                          : "text-base sm:text-lg"
                      }`}
                    >
                      <Link to={`/article/${item.id}`}>{item.title}</Link>
                    </h3>
                    {item.author && item.date && (
                      <div className="text-xs text-gray-500 mt-1">
                        <span>By {item.author}</span>
                        <span className="mx-1.5">|</span>
                        <span>
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    <ArticleCardStats
                      likes={item.initialLikes}
                      dislikes={item.initialDislikes}
                      commentCount={getCommentCountForArticle(item.id)}
                      articleId={item.id}
                      small={!item.isLarge}
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
        <section>
          <SectionTitle title="Latest Updates" />
          <div className="space-y-2.5 sm:space-y-3">
            {latestUpdatesIds
              .map((id) => getArticle(id))
              .filter(Boolean)
              .map((item) => (
                <div key={item.id} className="group">
                  <Link
                    to={`/article/${item.id}`}
                    className="block text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <div className="flex items-center space-x-1 mt-0.5 text-xs text-gray-500">
                    <MessageSquare size={12} className="text-gray-400" />
                    <span>{getCommentCountForArticle(item.id)}</span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* === BAGIAN KETIGA (BREAKING NEWS & TAGS) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
        <section className="lg:col-span-2">
          <SectionTitle title="Breaking News" />
          <div className="space-y-4 md:space-y-5">
            {breakingNewsIds
              .map((id) => getArticle(id))
              .filter(Boolean)
              .map((item) => (
                <div
                  key={item.id}
                  className="group flex gap-3 sm:gap-4 items-start"
                >
                  <Link
                    to={`/article/${item.id}`}
                    className="block w-1/3 sm:w-1/4 flex-shrink-0 rounded-md overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full object-cover aspect-video group-hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-none">
                      <Link to={`/article/${item.id}`}>{item.title}</Link>
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>By {item.author}</span>
                      <span className="mx-1.5">|</span>
                      <span>
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <ArticleCardStats
                      likes={item.initialLikes}
                      dislikes={item.initialDislikes}
                      commentCount={getCommentCountForArticle(item.id)}
                      articleId={item.id}
                      small
                    />
                  </div>
                </div>
              ))}
          </div>
        </section>
        <section>
          <SectionTitle title="Tags Category" />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tagsCategoryData.map((tag, index) => (
              <Link
                key={index}
                to={`/category/${createSlug(tag)}`}
                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
            <Link
              to="/categories"
              className="bg-gray-700 text-white text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-black transition-colors"
            >
              {moreTag}
            </Link>
          </div>
        </section>
      </div>

      {/* === BAGIAN KEEMPAT (MUST-READ STORIES) === */}
      <section>
        <SectionTitle title="Must-Read Stories" />
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
          {/* Kolom Kiri */}
          <div>
            {getArticle(mustReadProminentStoryLeftId) && (
              <div className="mb-6 md:mb-8 group">
                <Link
                  to={`/article/${mustReadProminentStoryLeftId}`}
                  className="block mb-2 sm:mb-3 rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={
                      getArticle(mustReadProminentStoryLeftId).imageLarge ||
                      getArticle(mustReadProminentStoryLeftId).image
                    }
                    alt={getArticle(mustReadProminentStoryLeftId).title}
                    className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
                  />
                </Link>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold group-hover:text-blue-600 transition-colors leading-tight line-clamp-3">
                  <Link to={`/article/${mustReadProminentStoryLeftId}`}>
                    {getArticle(mustReadProminentStoryLeftId).title}
                  </Link>
                </h3>
                <div className="text-xs sm:text-sm text-gray-500 mt-1.5">
                  <span>
                    By {getArticle(mustReadProminentStoryLeftId).author}
                  </span>{" "}
                  <span className="mx-2">|</span>{" "}
                  <span>
                    {new Date(
                      getArticle(mustReadProminentStoryLeftId).date
                    ).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <ArticleCardStats
                  likes={getArticle(mustReadProminentStoryLeftId).initialLikes}
                  dislikes={
                    getArticle(mustReadProminentStoryLeftId).initialDislikes
                  }
                  commentCount={getCommentCountForArticle(
                    mustReadProminentStoryLeftId
                  )}
                  articleId={mustReadProminentStoryLeftId}
                />
              </div>
            )}
            <div className="space-y-1 md:space-y-2">
              {mustReadSmallerStoriesLeftIds
                .map((id) => getArticle(id))
                .filter(Boolean)
                .map((story) => (
                  <div key={story.id} className="py-2">
                    <SmallStoryItem
                      {...story}
                      image={story.image || story.imageUrl}
                      link={`/article/${story.id}`}
                    />
                    <div className="pl-[calc(33.33%+0.5rem)] sm:pl-[calc(25%+0.5rem)]">
                      <ArticleCardStats
                        likes={story.initialLikes}
                        dislikes={story.initialDislikes}
                        commentCount={getCommentCountForArticle(story.id)}
                        articleId={story.id}
                        small
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Kolom Kanan */}
          <div className="mt-6 lg:mt-0">
            {getArticle(mustReadProminentStoryRightId) && (
              <div className="mb-6 md:mb-8 group">
                <Link
                  to={`/article/${mustReadProminentStoryRightId}`}
                  className="block mb-2 sm:mb-3 rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={
                      getArticle(mustReadProminentStoryRightId).imageLarge ||
                      getArticle(mustReadProminentStoryRightId).image
                    }
                    alt={getArticle(mustReadProminentStoryRightId).title}
                    className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
                  />
                </Link>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold group-hover:text-blue-600 transition-colors leading-tight line-clamp-3">
                  <Link to={`/article/${mustReadProminentStoryRightId}`}>
                    {getArticle(mustReadProminentStoryRightId).title}
                  </Link>
                </h3>
                <div className="text-xs sm:text-sm text-gray-500 mt-1.5">
                  <span>
                    By {getArticle(mustReadProminentStoryRightId).author}
                  </span>{" "}
                  <span className="mx-2">|</span>{" "}
                  <span>
                    {new Date(
                      getArticle(mustReadProminentStoryRightId).date
                    ).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <ArticleCardStats
                  likes={getArticle(mustReadProminentStoryRightId).initialLikes}
                  dislikes={
                    getArticle(mustReadProminentStoryRightId).initialDislikes
                  }
                  commentCount={getCommentCountForArticle(
                    mustReadProminentStoryRightId
                  )}
                  articleId={mustReadProminentStoryRightId}
                />
              </div>
            )}
            <div className="space-y-1 md:space-y-2">
              {mustReadSmallerStoriesRightIds
                .map((id) => getArticle(id))
                .filter(Boolean)
                .map((story) => (
                  <div key={story.id} className="py-2">
                    <SmallStoryItem
                      {...story}
                      image={story.image || story.imageUrl}
                      link={`/article/${story.id}`}
                    />
                    <div className="pl-[calc(33.33%+0.5rem)] sm:pl-[calc(25%+0.5rem)]">
                      <ArticleCardStats
                        likes={story.initialLikes}
                        dislikes={story.initialDislikes}
                        commentCount={getCommentCountForArticle(story.id)}
                        articleId={story.id}
                        small
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
