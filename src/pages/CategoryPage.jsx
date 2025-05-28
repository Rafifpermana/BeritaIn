// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  allArticlesData,
  initialCommentsData,
  calculateTotalComments,
} from "../data/mockData";
import ArticleCardStats from "../utils/ArticleCardStats";
// Anda bisa menambahkan ikon untuk judul jika mau, misal: import { Tag } from 'lucide-react';

// Fungsi untuk membuat slug (harus sama dengan yang di Navbar.jsx)
const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Daftar kategori, idealnya diimpor dari sumber yang sama dengan Navbar.jsx
// Atau Anda bisa mengambilnya dari mockData jika kategori artikel beragam
const CATEGORIES_LIST_FOR_DISPLAY = [
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

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [articles, setArticles] = useState([]);
  const [categoryNameDisplay, setCategoryNameDisplay] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const originalCatName = CATEGORIES_LIST_FOR_DISPLAY.find(
      (cat) => createSlug(cat) === categorySlug
    );

    if (originalCatName) {
      setCategoryNameDisplay(originalCatName);
    } else {
      // Fallback jika slug tidak match persis dengan nama kategori di list
      const displayNameFromSlug = categorySlug
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setCategoryNameDisplay(displayNameFromSlug);
    }

    const filteredArticles = Object.values(allArticlesData).filter(
      (article) =>
        article.category && createSlug(article.category) === categorySlug
    );
    setArticles(filteredArticles);
    setLoading(false);
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-gray-500 min-h-[calc(100vh-200px)] flex items-center justify-center">
        Memuat artikel kategori...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-250px)]">
      {" "}
      {/* Min height disesuaikan */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:text-blue-600">
                Beranda
              </Link>
              <svg
                className="fill-current w-3 h-3 mx-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>
            <li className="flex items-center">
              <span className="text-gray-700 font-medium">
                {categoryNameDisplay || "Kategori"}
              </span>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-800">
          {categoryNameDisplay || "Artikel Kategori"}
        </h1>
      </div>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col group"
            >
              <Link to={`/article/${article.id}`} className="block">
                {article.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  </div>
                )}
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <Link to={`/article/${article.id}`}>
                  <h2
                    className="text-md lg:text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3"
                    title={article.title}
                  >
                    {article.title}
                  </h2>
                </Link>
                {/* <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-grow">
                  {article.summary || article.contentHTML?.substring(0,70).replace(/<[^>]+>/g, '') + "..."}
                </p> */}
                <div className="text-xs text-gray-500 mt-auto pt-2">
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
                  likes={article.initialLikes || 0}
                  dislikes={article.initialDislikes || 0}
                  commentCount={calculateTotalComments(
                    initialCommentsData[article.id] || []
                  )}
                  articleId={article.id}
                  small
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <img
            src="/placeholder-empty-search.svg"
            alt="Tidak ada artikel"
            className="mx-auto h-40 mb-6 text-gray-400"
          />{" "}
          {/* Ganti dengan SVG atau gambar yang sesuai */}
          <p className="text-xl text-gray-700 font-semibold">
            Oops! Belum Ada Artikel
          </p>
          <p className="text-gray-500 mt-2">
            Tidak ada artikel yang ditemukan untuk kategori "
            {categoryNameDisplay}". Coba lihat kategori lain.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Kembali ke Beranda
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
