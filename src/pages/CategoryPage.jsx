// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"; // 1. Impor axios untuk memanggil API

// Gunakan apiClient yang sudah memiliki base URL dan otentikasi jika ada
// import apiClient from "../api/axios";

// Helper function untuk membuat slug (sebaiknya diimpor dari file utilitas bersama)
const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Alamat dasar API backend Anda
const API_BASE_URL = "http://localhost:8000/api";

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [articles, setArticles] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fungsi untuk mengambil data dari backend
    const fetchCategoryArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        // 2. Panggil API backend dengan parameter kategori dari URL
        const response = await axios.get(`${API_BASE_URL}/news`, {
          params: { category: categorySlug },
        });

        // 3. Proses data yang diterima dari backend
        if (response.data && Array.isArray(response.data.data)) {
          setArticles(response.data.data);

          // Ambil nama kategori dari artikel pertama yang diterima untuk ditampilkan sebagai judul
          const firstArticle = response.data.data[0];
          if (firstArticle && firstArticle.category) {
            setCategoryName(firstArticle.category);
          } else {
            // Jika tidak ada artikel, buat nama kategori dari slug untuk judul
            const displayName = categorySlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            setCategoryName(displayName);
          }
        } else {
          setArticles([]); // Jika data tidak valid, kosongkan artikel
        }
      } catch (err) {
        setError("Gagal memuat artikel untuk kategori ini.");
        console.error("Error fetching category articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [categorySlug]); // useEffect akan berjalan lagi setiap kali 'categorySlug' berubah

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center text-gray-500 min-h-[calc(100vh-200px)] flex items-center justify-center">
        Memuat artikel kategori...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-bold">{error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-250px)]">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          {/* ... Breadcrumb ... */}
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mt-3 text-gray-800">
          Kategori: {categoryName}
        </h1>
      </div>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            // 4. Render setiap artikel yang didapat dari API
            <div
              key={article.link} // Gunakan 'link' atau ID unik lain dari API sebagai key
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col group"
            >
              <Link
                to={`/article/${createSlug(article.title)}`}
                state={{ articleUrl: article.link }}
                className="block"
              >
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
                <Link
                  to={`/article/${createSlug(article.title)}`}
                  state={{ articleUrl: article.link }}
                >
                  <h2
                    className="text-md lg:text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3"
                    title={article.title}
                  >
                    {article.title}
                  </h2>
                </Link>
                <div className="text-xs text-gray-500 mt-auto pt-2">
                  <span className="font-medium">Tim Redaksi</span>
                  <br />
                  {new Date(article.pubDate).toLocaleDateString("id-ID", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                {/* Anda bisa menambahkan kembali ArticleCardStats jika diperlukan */}
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
          />
          <p className="text-xl text-gray-700 font-semibold">
            Oops! Belum Ada Artikel
          </p>
          <p className="text-gray-500 mt-2">
            Tidak ada artikel yang ditemukan untuk kategori "{categoryName}".
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg"
          >
            Kembali ke Beranda
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
