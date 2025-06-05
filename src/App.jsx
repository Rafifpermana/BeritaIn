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
import { ArticleInteractionProvider } from "./contexts/ArticleInteractionProvider"; // <-- IMPOR BARU

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
import UserBookmarksPage from "./dashboard/users/UserBookmarks";
import UserPointsPage from "./dashboard/users/UserPoints";
import CommunityGuidelinesPage from "./dashboard/users/CommunityGuidelines";
import DashboardOverview from "./dashboard/users/DashboardOverview";
import UserNotificationsPage from "./dashboard/users/UserNotifications";

//admin dasboard
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminOverview from "./dashboard/admin/AdminOverview";
import UserManagementPage from "./dashboard/admin/UserManagementPage";
import CommentModerationPage from "./dashboard/admin/CommentModerationPage";
import BroadcastNotificationPage from "./dashboard/admin/BroadcastNotificationPage";

// Layout Utama Aplikasi (Navbar & Footer)
const MainLayout = () => {
  const mobilePadding = "pt-2";
  const desktopNavbarHeight = "lg:pt-[12px]";
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="article/:articleId" element={<DetailPage />} />
            <Route path="category/:categorySlug" element={<CategoryPage />} />
            <Route path="search" element={<SearchResultsPage />} />
          </Route>

          <Route path="/user/dashboard" element={<UserDashboardPage />}>
            <Route index element={<DashboardOverview />} />
            <Route path="bookmarks" element={<UserBookmarksPage />} />
            <Route path="points" element={<UserPointsPage />} />
            <Route path="guidelines" element={<CommunityGuidelinesPage />} />
            <Route
              path="all-notifications"
              element={<UserNotificationsPage />}
            />
          </Route>

          <Route path="/admin/dashboard" element={<AdminDashboardPage />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="comments" element={<CommentModerationPage />} />
            <Route path="broadcast" element={<BroadcastNotificationPage />} />
            {/* Tambahkan rute admin lainnya di sini */}
          </Route>
        </Routes>
      </ArticleInteractionProvider>
    </Router>
  );
}
export default App;
