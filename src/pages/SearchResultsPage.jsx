import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ & /g, "-and-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  const [allResults, setAllResults] = useState([]);
  const [paginatedResults, setPaginatedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(12);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    window.scrollTo(0, 0);

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/news`, {
          params: {
            q: query,
            category: category || undefined,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setAllResults(response.data);
        } else {
          setAllResults([]);
        }
      } catch (err) {
        setError("Gagal melakukan pencarian.");
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, category]);

  useEffect(() => {
    if (allResults.length > 0) {
      const indexOfLastResult = currentPage * articlesPerPage;
      const indexOfFirstResult = indexOfLastResult - articlesPerPage;
      setPaginatedResults(
        allResults.slice(indexOfFirstResult, indexOfLastResult)
      );
    } else {
      setPaginatedResults([]);
    }
  }, [currentPage, allResults, articlesPerPage]);

  const totalPages = Math.ceil(allResults.length / articlesPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center min-h-[50vh] flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Mencari artikel...
        </p>
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Hasil Pencarian untuk: "{query}"
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {allResults.length} hasil ditemukan
        </p>
      </div>

      {paginatedResults.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedResults.map((article) => (
              <div
                key={article.link}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col group"
              >
                <Link
                  to={`/article/${createSlug(article.title)}`}
                  state={{ articleUrl: article.link }}
                  className="block aspect-video overflow-hidden rounded-t-lg"
                >
                  <img
                    src={article.image || "/placeholder-image.jpg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                  <h2
                    className="text-md font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-3 flex-grow"
                    title={article.title}
                  >
                    <Link
                      to={`/article/${createSlug(article.title)}`}
                      state={{ articleUrl: article.link }}
                    >
                      {article.title}
                    </Link>
                  </h2>
                  <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    <span className="font-medium">By Tim Redaksi</span>
                    <br />
                    {new Date(article.pubDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Kontrol Pagination */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Sebelumnya
            </button>
            <span className="text-gray-700">
              Halaman <strong>{currentPage}</strong> dari{" "}
              <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Berikutnya &rarr;
            </button>
          </div>
        </>
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
            Tidak ada hasil yang cocok untuk pencarian Anda. Coba kata kunci
            lain.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-lg shadow-md hover:bg-blue-700"
          >
            Kembali ke Beranda
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
