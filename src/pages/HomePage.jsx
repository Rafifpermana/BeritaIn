import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import BookmarkButton from "../components/BookmarkButton";
import { useHomeContent } from "../contexts/HomeContentProvider";
import ArticleCardStats from "../utils/ArticleCardStats";

// --- PERBAIKAN: Tentukan URL dasar untuk backend API Anda ---
// Pastikan URL ini cocok dengan tempat backend Laravel Anda berjalan (misalnya, dari `php artisan serve`)
const API_BASE_URL = "http://localhost:8000";

// Helper function to create a URL-friendly slug from a title
const createSlug = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Reusable component for section titles
const SectionTitle = ({ title }) => (
  <div className="flex items-center mb-3 md:mb-5">
    <span className="w-1 h-5 sm:h-6 bg-black mr-2 sm:mr-3"></span>
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h2>
  </div>
);

// Reusable component for small story items
const SmallStoryItem = ({ article }) => (
  <div className="group flex gap-3 items-start">
    <div className="relative w-1/3 sm:w-1/4 flex-shrink-0">
      <Link
        to={`/article/${createSlug(article.title)}`}
        state={{ articleUrl: article.link }}
        className="block rounded-md overflow-hidden"
      >
        <img
          src={article.image || "/placeholder-image.jpg"}
          alt={article.title}
          className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <BookmarkButton
          articleId={article.link}
          className="bg-black/30 backdrop-blur-sm"
        />
      </div>
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-none">
        <Link
          to={`/article/${createSlug(article.title)}`}
          state={{ articleUrl: article.link }}
        >
          {article.title}
        </Link>
      </h4>
      <div className="text-xs text-gray-500 mt-1">
        <span>By {article.author || "Unknown Author"}</span>
        <span className="mx-1.5">|</span>
        <span>
          {new Date(article.pubDate).toLocaleDateString("id-ID", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="mt-2">
        <ArticleCardStats
          likes={article.likes_count || 0}
          dislikes={article.dislikes_count || 0}
          comments={article.comments_count || 0}
        />
      </div>
    </div>
  </div>
);

const HomePage = () => {
  // 2. Ambil semua data langsung dari context. Tidak ada lagi useState atau useEffect di sini.
  const { articles, categories, loading, error } = useHomeContent();

  // 3. Logika untuk menampilkan loading, error, atau "tidak ada berita" tetap sama.
  if (loading) {
    return (
      <div className="text-center py-20 font-bold text-lg">
        Memuat Berita...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-bold">{error}</div>
    );
  }

  if (!articles.main && articles.popular.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Tidak Ada Berita</h2>
        <p className="text-gray-600">
          Saat ini tidak ada berita yang tersedia. Coba lagi nanti.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-8">
      {/* === BAGIAN PERTAMA === */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8 sm:mb-10 md:mb-12">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {articles.main && (
            <>
              <div className="relative rounded-lg overflow-hidden shadow-lg group">
                <Link
                  to={`/article/${createSlug(articles.main.title)}`}
                  state={{ articleUrl: articles.main.link }}
                  className="block"
                >
                  <img
                    src={articles.main.image}
                    alt={articles.main.title}
                    className="w-full h-auto object-cover hidden md:block"
                    style={{ aspectRatio: "1.8 / 1" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-laptop.jpg";
                    }}
                  />
                  <img
                    src={articles.main.image}
                    alt={articles.main.title}
                    className="w-full h-auto object-cover md:hidden aspect-[4/3] sm:aspect-video"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-laptop-mobile.jpg";
                    }}
                  />
                </Link>
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BookmarkButton
                    articleId={articles.main.link}
                    className="bg-black/30 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold hover:text-blue-600 transition-colors leading-tight">
                  <Link
                    to={`/article/${createSlug(articles.main.title)}`}
                    state={{ articleUrl: articles.main.link }}
                  >
                    {articles.main.title}
                  </Link>
                </h2>
                <div className="flex items-center mt-1.5 text-gray-500 text-xs sm:text-sm">
                  <span>By {articles.main.author || "Tim Redaksi"}</span>
                  <span className="mx-2">|</span>
                  <span>
                    {new Date(articles.main.pubDate).toLocaleDateString(
                      "id-ID",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </span>
                </div>
                <div className="mt-3">
                  <ArticleCardStats
                    likes={articles.main.likes_count || 0}
                    dislikes={articles.main.dislikes_count || 0}
                    comments={articles.main.comments_count || 0}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="space-y-3 sm:space-y-4 lg:space-y-3">
          {articles.popular.map((post) => (
            <div
              key={post.link}
              className="grid grid-cols-3 gap-2.5 sm:gap-3 items-start group"
            >
              <div className="col-span-1 relative rounded-md overflow-hidden">
                <Link
                  to={`/article/${createSlug(post.title)}`}
                  state={{ articleUrl: post.link }}
                  className="block"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover aspect-[4/3] group-hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <BookmarkButton
                    articleId={post.link}
                    className="bg-black/30 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-3">
                  <Link
                    to={`/article/${createSlug(post.title)}`}
                    state={{ articleUrl: post.link }}
                  >
                    {post.title}
                  </Link>
                </h3>
                <div className="flex items-center mt-1 text-gray-500 text-xs">
                  <span>By {post.author || "Tim Redaksi"}</span>
                  <span className="mx-1.5">|</span>
                  <span>
                    {new Date(post.pubDate).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-2">
                  <ArticleCardStats
                    likes={post.likes_count || 0}
                    dislikes={post.dislikes_count || 0}
                    comments={post.comments_count || 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === BAGIAN KEDUA === */}
      <section className="mb-8 sm:mb-10 md:mb-12">
        <SectionTitle title="Recommendation News" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {articles.recommendation.map((item) => (
            <div key={item.link} className="group">
              <h3 className="text-base sm:text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                <Link
                  to={`/article/${createSlug(item.title)}`}
                  state={{ articleUrl: item.link }}
                >
                  {item.title}
                </Link>
              </h3>
              <div className="text-xs text-gray-500">
                <span>By {item.author || "Tim Redaksi"}</span>
                <span className="mx-1.5">|</span>
                <span>
                  {new Date(item.pubDate).toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <ArticleCardStats
                  likes={item.likes_count || 0}
                  dislikes={item.dislikes_count || 0}
                  comments={item.comments_count || 0}
                />
                <BookmarkButton
                  articleId={item.link}
                  className="text-gray-500 hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === BAGIAN TRENDING NOW & LATEST UPDATES === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
        <section className="lg:col-span-2">
          <SectionTitle title="Trending Now" />
          <div className="space-y-5 md:space-y-6">
            {articles.trending.map((item, index) => {
              const isLarge = index === 0; // Make the first item larger
              return (
                <div
                  key={item.link}
                  className={`group flex flex-col ${
                    isLarge ? "md:flex-row" : "sm:flex-row"
                  } gap-3 sm:gap-4 items-start`}
                >
                  <Link
                    to={`/article/${createSlug(item.title)}`}
                    state={{ articleUrl: item.link }}
                    className={`block relative rounded-md overflow-hidden ${
                      isLarge
                        ? "w-full sm:w-2/5 md:w-1/2 lg:w-2/5"
                        : "w-full sm:w-1/3"
                    } flex-shrink-0`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full object-cover group-hover:opacity-80 transition-opacity ${
                        isLarge
                          ? "aspect-video"
                          : "aspect-[4/3] sm:aspect-video"
                      }`}
                    />
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookmarkButton
                        articleId={item.link}
                        className="bg-black/30 backdrop-blur-sm"
                      />
                    </div>
                  </Link>
                  <div
                    className={`flex-1 ${
                      isLarge ? "mt-2 sm:mt-0" : "mt-2 sm:mt-0"
                    }`}
                  >
                    <h3
                      className={`font-semibold group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-none ${
                        isLarge
                          ? "text-lg sm:text-xl md:text-2xl"
                          : "text-base sm:text-lg"
                      }`}
                    >
                      <Link
                        to={`/article/${createSlug(item.title)}`}
                        state={{ articleUrl: item.link }}
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>By {item.author || "Tim Redaksi"}</span>
                      <span className="mx-1.5">|</span>
                      <span>
                        {new Date(item.pubDate).toLocaleDateString("id-ID", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mt-2">
                      <ArticleCardStats
                        likes={item.likes_count || 0}
                        dislikes={item.dislikes_count || 0}
                        comments={item.comments_count || 0}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <SectionTitle title="Latest Updates" />
          <div className="space-y-2.5 sm:space-y-3">
            {articles.latest.map((item) => (
              <div
                key={item.link}
                className="group flex justify-between items-start gap-2"
              >
                <div className="flex-1">
                  <Link
                    to={`/article/${createSlug(item.title)}`}
                    state={{ articleUrl: item.link }}
                    className="block text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-1">
                    <ArticleCardStats
                      likes={item.likes_count || 0}
                      dislikes={item.dislikes_count || 0}
                      comments={item.comments_count || 0}
                    />
                  </div>
                </div>
                <BookmarkButton
                  articleId={item.link}
                  className="text-gray-400 hover:text-yellow-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
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
            {articles.breaking.slice(0, 6).map((item) => (
              <SmallStoryItem key={item.link} article={item} />
            ))}
          </div>
        </section>
        <section>
          <SectionTitle title="Tags Category" />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((tag) => (
              <Link
                key={tag.name} // <-- GUNAKAN 'tag.name' SEBAGAI KEY YANG UNIK
                to={`/category/${createSlug(tag.name)}`}
                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* === BAGIAN KEEMPAT (MUST-READ STORIES) === */}
      {articles.mustRead && articles.mustRead.length > 0 && (
        <section>
          <SectionTitle title="Must-Read Stories" />
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8">
            {/* Kolom Kiri */}
            <div>
              {articles.mustRead[0] && (
                <div className="mb-6 md:mb-8 group">
                  <div className="relative block mb-2 sm:mb-3 rounded-lg overflow-hidden shadow-md">
                    <Link
                      to={`/article/${createSlug(articles.mustRead[0].title)}`}
                      state={{ articleUrl: articles.mustRead[0].link }}
                    >
                      <img
                        src={articles.mustRead[0].image}
                        alt={articles.mustRead[0].title}
                        className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookmarkButton
                        articleId={articles.mustRead[0].link}
                        className="bg-black/30 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold group-hover:text-blue-600 transition-colors leading-tight line-clamp-3">
                    <Link
                      to={`/article/${createSlug(articles.mustRead[0].title)}`}
                      state={{ articleUrl: articles.mustRead[0].link }}
                    >
                      {articles.mustRead[0].title}
                    </Link>
                  </h3>
                  <div className="mt-2">
                    <ArticleCardStats
                      likes={articles.mustRead[0].likes_count || 0}
                      dislikes={articles.mustRead[0].dislikes_count || 0}
                      comments={articles.mustRead[0].comments_count || 0}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1 md:space-y-2">
                {articles.mustRead.slice(1, 4).map((story) => (
                  <div key={story.link} className="py-2">
                    <SmallStoryItem article={story} />
                  </div>
                ))}
              </div>
            </div>
            {/* Kolom Kanan */}
            <div className="mt-6 lg:mt-0">
              {articles.mustRead[4] && (
                <div className="mb-6 md:mb-8 group">
                  <div className="relative block mb-2 sm:mb-3 rounded-lg overflow-hidden shadow-md">
                    <Link
                      to={`/article/${createSlug(articles.mustRead[4].title)}`}
                      state={{ articleUrl: articles.mustRead[4].link }}
                    >
                      <img
                        src={articles.mustRead[4].image}
                        alt={articles.mustRead[4].title}
                        className="w-full object-cover aspect-video sm:aspect-[16/9] group-hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BookmarkButton
                        articleId={articles.mustRead[4].link}
                        className="bg-black/30 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold group-hover:text-blue-600 transition-colors leading-tight line-clamp-3">
                    <Link
                      to={`/article/${createSlug(articles.mustRead[4].title)}`}
                      state={{ articleUrl: articles.mustRead[4].link }}
                    >
                      {articles.mustRead[4].title}
                    </Link>
                  </h3>
                  <div className="mt-2">
                    <ArticleCardStats
                      likes={articles.mustRead[4].likes_count || 0}
                      dislikes={articles.mustRead[4].dislikes_count || 0}
                      comments={articles.mustRead[4].comments_count || 0}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1 md:space-y-2">
                {articles.mustRead.slice(5, 8).map((story) => (
                  <div key={story.link} className="py-2">
                    <SmallStoryItem article={story} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default HomePage;
