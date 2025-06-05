// src/pages/UserBookmarksPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import { allArticlesData } from "../../data/mockData";
import ArticleCardStats from "../../utils/ArticleCardStats";
import { Bookmark } from "lucide-react";

const UserBookmarks = () => {
  const { articleInteractions, getCommentCountForArticleContext } =
    useArticleInteractions();

  const bookmarkedArticlesDetails = Object.entries(articleInteractions)
    .filter(([articleId, interaction]) => interaction.isBookmarked)
    .map(([articleId, interaction]) => {
      const staticData = allArticlesData[articleId];
      if (!staticData) return null;

      return {
        ...staticData,
        likes: interaction.likes,
        dislikes: interaction.dislikes,
        commentCount: getCommentCountForArticleContext(articleId),
      };
    })
    .filter(Boolean);

  return (
    <div className="p-1 sm:p-2 md:p-4">
      {" "}
      {/* Padding dikurangi agar lebih pas di dalam Outlet */}
      <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
        <Bookmark size={24} className="text-blue-600 mr-2 sm:mr-3" />{" "}
        {/* Ukuran ikon disesuaikan */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Artikel Disimpan
        </h1>
      </div>
      {bookmarkedArticlesDetails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {" "}
          {/* Penyesuaian grid dan gap */}
          {bookmarkedArticlesDetails.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col group"
            >
              <Link to={`/article/${article.id}`} className="block">
                {article.image && (
                  <div className="w-full h-40 sm:h-44 overflow-hidden">
                    {" "}
                    {/* Tinggi gambar disesuaikan */}
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  </div>
                )}
              </Link>
              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <Link to={`/article/${article.id}`}>
                  <h2
                    className="text-sm sm:text-base font-semibold mb-1.5 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2"
                    title={article.title}
                  >
                    {article.title}
                  </h2>
                </Link>
                <div className="text-xs text-gray-500 mt-auto pt-1.5">
                  <span className="font-medium">
                    {article.author || "Penulis"}
                  </span>{" "}
                  <br />
                  {new Date(article.date).toLocaleDateString("id-ID", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <ArticleCardStats
                  likes={article.likes}
                  dislikes={article.dislikes}
                  commentCount={article.commentCount}
                  articleId={article.id}
                  small
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark size={40} className="mx-auto text-gray-300 mb-4" />{" "}
          {/* Ukuran ikon disesuaikan */}
          <p className="text-lg sm:text-xl text-gray-700 font-semibold">
            Belum Ada Artikel Disimpan
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Mulai sukai artikel untuk menyimpannya di sini.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-5 py-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-lg shadow-md hover:bg-blue-700 ..."
          >
            Jelajahi Artikel
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserBookmarks;
