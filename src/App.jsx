import React from "react"; // useState dan useRef sudah tidak digunakan di sini
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DetailPage from "./pages/DetailPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ScrollToTop from "./utils/ScrollToTop"; // <--- IMPORT KOMPONEN BARU

// Layout dengan Navbar & Footer
const MainLayout = () => {
  const mobilePadding = "pt-5";
  const desktopPadding = "lg:pt-[25px]";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={`flex-grow ${mobilePadding} ${desktopPadding}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* <--- TAMBAHKAN KOMPONEN ScrollToTop DI SINI */}
      <Routes>
        {/* Public routes tanpa layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes utama dengan navbar & footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/article/:articleId" element={<DetailPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          {/* Tambahkan route lain yang menggunakan MainLayout di sini */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
