// src/pages/UserDashboardPage.jsx
import React from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Bookmark as BookmarkIconLucide,
  Info,
  LogOut,
  Bell,
  Award,
} from "lucide-react"; // Tambahkan Award

const UserDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/user" },
    {
      name: "Bookmark",
      icon: BookmarkIconLucide,
      path: "/dashboard/user/bookmarks",
    },
    { name: "Poin Saya", icon: Award, path: "/dashboard/user/points" }, // <-- LINK BARU UNTUK POIN
    {
      name: "Panduan Komunitas",
      icon: Info,
      path: "/dashboard/user/guidelines",
    },
  ];

  const userName = "ipsum_Larisun"; // Placeholder
  const userAvatarPlaceholder = "/placeholder-avatar.png"; // Placeholder

  const handleLogout = () => {
    console.log("Pengguna logout...");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Utama Dashboard */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Logo Utama
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell size={22} />
                <span className="sr-only">View notifications</span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={userAvatarPlaceholder}
                  alt="User Avatar"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-100 pt-4 pb-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-600 uppercase tracking-wider">
            Dashboard User
          </h1>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:flex lg:items-start lg:space-x-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0 mb-6 lg:mb-0">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-gray-200">
                  <div className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700">
                    Logo Dash
                  </div>
                </div>
                <nav className="space-y-1.5">
                  {sidebarLinks.map((link) => {
                    const isActive =
                      location.pathname === link.path ||
                      (link.path !== "/dashboard/user" &&
                        location.pathname.startsWith(link.path));
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out
                                    ${
                                      isActive
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                      >
                        <link.icon
                          size={18}
                          className={`mr-3 flex-shrink-0 
                                      ${
                                        isActive
                                          ? "text-white"
                                          : "text-gray-400 group-hover:text-gray-500"
                                      }`}
                        />
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 ease-in-out"
                >
                  <LogOut
                    size={18}
                    className="mr-3 text-gray-400 group-hover:text-red-500"
                  />
                  Logout
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
export default UserDashboardPage;
