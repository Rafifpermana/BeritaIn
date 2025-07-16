import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// Komponen Utama & Provider
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./utils/ScrollToTop";
import { ArticleInteractionProvider } from "./contexts/ArticleInteractionProvider";
import { HomeContentProvider } from "./contexts/HomeContentProvider";

// Halaman
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Dashboard User & Admin
import UserDashboardPage from "./pages/UserDashboardPage";
import DashboardOverview from "./dashboard/users/DashboardOverview";
import UserBookmarks from "./dashboard/users/UserBookmarks";
import UserPoints from "./dashboard/users/UserPoints";
import CommunityGuidelines from "./dashboard/users/CommunityGuidelines";
import UserNotifications from "./dashboard/users/UserNotifications";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminOverview from "./dashboard/admin/AdminOverview";
import UserManagementPage from "./dashboard/admin/UserManagementPage";
import CommentModerationPage from "./dashboard/admin/CommentModerationPage";
import BroadcastNotificationPage from "./dashboard/admin/BroadcastNotificationPage";

// Utility Proteksi
import ProtectedRoute from "./utils/ProtectedRoute";

// Layout Utama (Navbar & Footer)
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-2 lg:pt-3">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ArticleInteractionProvider>
        <HomeContentProvider>
          <ScrollToTop />
          <Routes>
            {/* Rute Publik */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rute dengan Layout Utama (bisa diakses publik) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="article/:articleId" element={<DetailPage />} />
              <Route path="category/:categorySlug" element={<CategoryPage />} />
              <Route path="search" element={<SearchResultsPage />} />
            </Route>

            {/* Rute Terproteksi untuk User Biasa */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user/dashboard" element={<UserDashboardPage />}>
                <Route index element={<DashboardOverview />} />
                <Route path="bookmarks" element={<UserBookmarks />} />
                <Route path="points" element={<UserPoints />} />
                <Route path="guidelines" element={<CommunityGuidelines />} />
                <Route
                  path="all-notifications"
                  element={<UserNotifications />}
                />
              </Route>
            </Route>

            {/* Rute Terproteksi Admin */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="comments" element={<CommentModerationPage />} />
                <Route
                  path="broadcast"
                  element={<BroadcastNotificationPage />}
                />
              </Route>
            </Route>
          </Routes>
        </HomeContentProvider>
      </ArticleInteractionProvider>
    </Router>
  );
}

export default App;
