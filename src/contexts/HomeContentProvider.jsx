// src/contexts/HomeContentProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const HomeContentContext = createContext();

export const useHomeContent = () => useContext(HomeContentContext);

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export const HomeContentProvider = ({ children }) => {
  const [articles, setArticles] = useState({
    main: null,
    popular: [],
    recommendation: [],
    trending: [],
    latest: [],
    breaking: [],
    mustRead: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [newsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/news`, {
            params: { limit_per_source: 50 },
          }),
          axios.get(`${API_BASE_URL}/categories`),
        ]);

        // ================= PERBAIKAN UTAMA DI SINI =================
        let newsData = []; // Siapkan array kosong

        // Cek jika respons adalah objek paginasi (memiliki properti 'data')
        if (newsResponse.data && Array.isArray(newsResponse.data.data)) {
          newsData = newsResponse.data.data;
        }
        // Cek jika respons adalah array langsung
        else if (Array.isArray(newsResponse.data)) {
          newsData = newsResponse.data;
        }

        if (newsData.length > 0) {
          const allNews = shuffleArray(newsData);
          const articlesWithImages = allNews.filter((a) => a.image);

          console.log("Total news:", allNews.length);
          console.log("Articles with images:", articlesWithImages.length);

          setArticles({
            main: articlesWithImages[0] || allNews[0],
            popular:
              articlesWithImages.slice(1, 5).length >= 4
                ? articlesWithImages.slice(1, 5)
                : allNews.slice(1, 5),
            recommendation: allNews.slice(5, 8),
            trending:
              articlesWithImages.slice(8, 12).length >= 4
                ? articlesWithImages.slice(8, 12)
                : allNews.slice(8, 12),
            latest: allNews.slice(12, 18),
            breaking:
              articlesWithImages.slice(18, 24).length >= 6
                ? articlesWithImages.slice(18, 24)
                : allNews.slice(18, 24),
            mustRead:
              articlesWithImages.slice(24, 32).length >= 8
                ? articlesWithImages.slice(24, 32)
                : allNews.slice(24, 32),
          });
          console.log(
            "Breaking news count:",
            articlesWithImages.slice(18, 24).length
          );
          console.log(
            "Must read count:",
            articlesWithImages.slice(24, 32).length
          );
        }
        // ==========================================================

        // Proses kategori (ini sudah benar)
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        }

        setHasFetched(true);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [hasFetched]);

  const value = { articles, categories, loading, error };

  return (
    <HomeContentContext.Provider value={value}>
      {children}
    </HomeContentContext.Provider>
  );
};
