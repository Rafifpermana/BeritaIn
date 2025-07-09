// src/dashboard/users/UserBookmarks.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import ArticleCardStats from "../../utils/ArticleCardStats.jsx";
import { Bookmark } from "lucide-react";

// Helper function untuk membuat slug (konsisten dengan bagian lain)
const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const UserBookmarks = () => {
  // Ambil state dan fungsi yang kita butuhkan dari context
  const {
    bookmarkedArticles,
    fetchBookmarkedArticles,
    getCommentCountForArticleContext,
  } = useArticleInteractions();

  // Panggil fungsi untuk mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchBookmarkedArticles();
  }, [fetchBookmarkedArticles]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
        <Bookmark size={24} className="text-blue-600 mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Artikel Disimpan
        </h1>
      </div>

      {bookmarkedArticles && bookmarkedArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarkedArticles.map((article) => (
            <div
              key={article.id} // Gunakan ID artikel yang unik
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group border"
            >
              {/* Setiap card adalah sebuah Link ke halaman detail */}
              <Link
                to={`/article/${createSlug(article.title)}`}
                state={{ articleUrl: article.url }} // Kirim URL asli sebagai state
                className="block"
              >
                {article.image_url && (
                  <div className="w-full h-44 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <Link
                  to={`/article/${createSlug(article.title)}`}
                  state={{ articleUrl: article.url }}
                >
                  <h2
                    className="text-base font-semibold mb-2 text-gray-900 group-hover:text-blue-600 line-clamp-2"
                    title={article.title}
                  >
                    {article.title}
                  </h2>
                </Link>
                <div className="text-xs text-gray-500 mt-auto pt-2">
                  {/* Sesuaikan dengan data yang ada di objek artikel */}
                  <span className="font-medium">{article.source_name}</span>
                  <br />
                  {new Date(article.published_at).toLocaleDateString("id-ID", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                {/* Jika Anda punya data likes/dislikes/comments, tampilkan di sini */}
                <ArticleCardStats
                  likes={article.likes_count || 0}
                  dislikes={article.dislikes_count || 0}
                  commentCount={getCommentCountForArticleContext(article.url)}
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
            Anda bisa menyimpan artikel dengan menekan ikon bookmark pada
            halaman berita.
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
