// src/utils/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Dapatkan pathname saat ini dari URL

  useEffect(() => {
    // Lakukan scroll ke atas (0, 0) setiap kali pathname berubah
    window.scrollTo(0, 0);
  }, [pathname]); // Efek ini akan berjalan setiap kali pathname berubah

  return null; // Komponen ini tidak me-render apa pun ke DOM
};

export default ScrollToTop;
