// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// Komponen Utama
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import { ArticleInteractionProvider } from "./contexts/ArticleInteractionContext";

// Halaman Utama
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResultsPage from "./pages/SearchResultsPage";

// Halaman Auth
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Halaman Dashboard & Komponen Terkait
import UserDashboardPage from "./pages/UserDashboardPage";
import UserBookmarksPage from "./dashboard/UserBookmarks";
import DashboardOverview from "./dashboard/DashboardOverview"; // Impor dari file terpisah
import CommunityGuidelinesPage from "./dashboard/CommunityGuidelines";
import UserPointsPage from "./dashboard/UserPoints";

// Komponen StatCard dan ikonnya tidak lagi perlu diimpor di App.jsx, karena sudah di DashboardOverview.jsx

// Layout Utama Aplikasi (Navbar & Footer)
const MainLayout = () => {
  const mobilePadding = "pt-5";
  const desktopNavbarHeight = "lg:pt-[15px]";
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={`flex-grow ${mobilePadding} ${desktopNavbarHeight}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Komponen Aplikasi Utama
function App() {
  return (
    <Router>
      <ArticleInteractionProvider>
        <ScrollToTop />
        <Routes>
          {/* ... (Rute Login, Register, dan MainLayout lainnya tetap sama) ... */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="article/:articleId" element={<DetailPage />} />
            <Route path="category/:categorySlug" element={<CategoryPage />} />
            <Route path="search" element={<SearchResultsPage />} />
          </Route>

          <Route path="/dashboard/user" element={<UserDashboardPage />}>
            <Route index element={<DashboardOverview />} />
            <Route path="bookmarks" element={<UserBookmarksPage />} />
            <Route path="guidelines" element={<CommunityGuidelinesPage />} />
            <Route path="points" element={<UserPointsPage />} />{" "}
            {/* <-- RUTE BARU */}
          </Route>
        </Routes>
      </ArticleInteractionProvider>
    </Router>
  );
}
export default App;
