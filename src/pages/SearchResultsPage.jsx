// src/pages/SearchResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  allArticlesData,
  initialCommentsData,
  calculateTotalComments,
} from "../data/mockData";
import ArticleCardStats from "../utils/ArticleCardStats";

// Fungsi untuk membuat slug (harus sama dengan yang di Navbar.jsx)
const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const CATEGORIES_LIST_FOR_DISPLAY = [
  // Sama seperti di CategoryPage
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

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const categorySlugFromQuery = searchParams.get("category");
  const [results, setResults] = useState([]);
  const [categoryNameDisplay, setCategoryNameDisplay] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (query) {
      let filteredArticles = Object.values(allArticlesData);

      if (categorySlugFromQuery) {
        const originalCatName = CATEGORIES_LIST_FOR_DISPLAY.find(
          (cat) => createSlug(cat) === categorySlugFromQuery
        );
        if (originalCatName) {
          setCategoryNameDisplay(originalCatName);
        } else {
          setCategoryNameDisplay(
            categorySlugFromQuery
              .replace(/-/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          );
        }

        filteredArticles = filteredArticles.filter(
          (article) =>
            article.category &&
            createSlug(article.category) === categorySlugFromQuery
        );
      } else {
        setCategoryNameDisplay("");
      }

      filteredArticles = filteredArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          (article.contentHTML &&
            article.contentHTML.toLowerCase().includes(query.toLowerCase())) ||
          (article.author &&
            article.author.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filteredArticles);
    } else {
      setResults([]); // Jika tidak ada query, kosongkan hasil
    }
    setLoading(false);
  }, [query, categorySlugFromQuery]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-gray-500 min-h-[calc(100vh-200px)] flex items-center justify-center">
        Mencari artikel...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-250px)]">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Hasil Pencarian untuk: "{query}"
        </h1>
        {categoryNameDisplay && (
          <p className="text-md text-gray-600 mt-1">
            Dalam kategori:{" "}
            <span className="font-semibold text-blue-600">
              {categoryNameDisplay}
            </span>
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((article) => (
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
            alt="Tidak ada hasil"
            className="mx-auto h-40 mb-6 text-gray-400"
          />
          <p className="text-xl text-gray-700 font-semibold">
            Oops! Hasil Tidak Ditemukan
          </p>
          <p className="text-gray-500 mt-2">
            Tidak ada hasil yang cocok untuk pencarian "{query}"{" "}
            {categoryNameDisplay
              ? `dalam kategori "${categoryNameDisplay}"`
              : ""}
            .
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

export default SearchResultsPage;
