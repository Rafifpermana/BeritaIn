// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Lock, AlertCircle, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { allUsersData } from "../data/mockData"; // <-- Impor data user untuk cek role

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginSuccess = await login(email, password);

    if (loginSuccess) {
      // --- LOGIKA PERBAIKAN ---
      // Setelah login berhasil, kita periksa role user secara manual dari data
      // untuk menentukan tujuan redirect.
      const user = allUsersData.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      // Jika ada halaman tujuan sebelumnya (misal: mencoba akses halaman terproteksi), kembali ke sana
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // Jika tidak, arahkan berdasarkan peran
      if (user && user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-700 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-80 sm:opacity-100">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse cx="-43.6503" cy="720" rx="374.35" ry="362" fill="#264ECA" />
          <ellipse
            cx="-43.6503"
            cy="720"
            rx="295.757"
            ry="286"
            fill="#244BC5"
          />
          <ellipse
            cx="-43.6504"
            cy="720"
            rx="226.471"
            ry="219"
            fill="#274FC7"
          />
          <path
            d="M651.792 139C511.566 151.8 416.186 51 386.025 -1L1279.5 2.5V720.5H1179.71C870.714 682.5 922.73 531 987.362 460C1025.11 410.167 1093.36 290.1 1064.4 208.5C1028.21 106.5 827.075 123 651.792 139Z"
            fill="#264ECA"
          />
        </svg>
      </div>
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm">
        <div className="text-center mb-6">
          <Link to="/" className="text-3xl font-bold text-white">
            Berita<span className="text-orange-400">In</span>
          </Link>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
          <h2 className="text-xl font-bold text-white text-center mb-1">
            Selamat Datang!
          </h2>
          <p className="text-xs text-center text-blue-100 opacity-90 mb-6">
            Masuk untuk melanjutkan.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/75 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL"
                  required
                  className="w-full bg-transparent border border-white/50 text-white placeholder:text-white/70 px-3.5 py-2.5 pl-10 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/75 w-4 h-4" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD"
                  required
                  className="w-full bg-transparent border border-white/50 text-white placeholder:text-white/70 px-3.5 py-2.5 pl-10 rounded-lg text-sm"
                />
              </div>
            </div>
            {error && (
              <div className="flex items-center text-xs text-red-300 bg-red-900/40 p-2.5 rounded-md">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <LogIn size={16} />
              <span>{loading ? "MEMPROSES..." : "LOGIN"}</span>
            </button>
            <div className="text-center text-xs text-white/90 mt-6">
              Belum punya akun?{" "}
              <Link to="/register" className="font-medium hover:underline">
                Daftar di sini
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
