// src/dashboard/users/UserBookmarks.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import { allArticlesData } from "../../data/mockData.js";
import ArticleCardStats from "../../utils/ArticleCardStats.jsx";
import { Bookmark } from "lucide-react";

const UserBookmarks = () => {
  const { articleInteractions, getCommentCountForArticleContext } =
    useArticleInteractions();

  // Guard clause untuk memastikan articleInteractions adalah objek sebelum diolah
  const bookmarkedArticlesDetails =
    articleInteractions && typeof articleInteractions === "object"
      ? Object.entries(articleInteractions)
          .filter(([, interaction]) => interaction.isBookmarked)
          .map(([articleId, interaction]) => {
            const staticData = allArticlesData[articleId];
            if (!staticData) return null; // Lewati jika data artikel tidak ditemukan

            return {
              ...staticData,
              likes: interaction.likes,
              dislikes: interaction.dislikes,
              commentCount: getCommentCountForArticleContext(articleId),
            };
          })
          .filter(Boolean) // Hapus item null dari array
      : []; // Jika articleInteractions belum siap, kembalikan array kosong

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
        <Bookmark size={24} className="text-blue-600 mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Artikel Disimpan
        </h1>
      </div>

      {bookmarkedArticlesDetails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarkedArticlesDetails.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group border"
            >
              <Link to={`/article/${article.id}`} className="block">
                {article.image && (
                  <div className="w-full h-44 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <Link to={`/article/${article.id}`}>
                  <h2
                    className="text-base font-semibold mb-2 text-gray-900 group-hover:text-blue-600 line-clamp-2"
                    title={article.title}
                  >
                    {article.title}
                  </h2>
                </Link>
                <div className="text-xs text-gray-500 mt-auto pt-2">
                  <span className="font-medium">{article.author}</span>
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
          <Bookmark size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-semibold text-gray-700">
            Belum Ada Artikel Disimpan
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Anda bisa menyimpan artikel dengan menekan tombol "Suka" pada
            halaman detail artikel.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-5 py-2 bg-blue-600 text-white font-medium text-xs rounded-lg shadow-md hover:bg-blue-700"
          >
            Jelajahi Artikel
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserBookmarks;
