// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { User, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { username, password });
    // TODO: Integrate auth logic
  };

  return (
    <div className="relative min-h-screen bg-blue-700 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background SVG (tetap sama) */}
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

      {/* Logo dan Nama Aplikasi */}
      <div className="relative z-10 mb-6 sm:mb-8">
        <Link to="/" className="flex flex-col items-center group">
          <span className="text-xl sm:text-3xl font-bold text-white group-hover:text-orange-200 transition-colors">
            Berita
            <span className="text-orange-600 group-hover:text-blue-200 transition-colors">
              In
            </span>
          </span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
        <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-1">
          Selamat Datang!
        </h2>
        <p className="text-xs text-center text-blue-100 opacity-90 mb-6">
          Masuk untuk melanjutkan.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-75 w-4 h-4" />
              <input
                id="email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="EMAIL"
                required
                className="w-full bg-transparent border border-white/50 text-white placeholder-white placeholder-opacity-70 px-3.5 py-2.5 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-75 w-4 h-4" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                required
                className="w-full bg-transparent border border-white/50 text-white placeholder-white placeholder-opacity-70 px-3.5 py-2.5 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
            </div>
          </div>
          <div className="text-right mt-2 mb-3">
            <a
              href="#"
              className="text-xs text-blue-200 hover:text-white hover:underline"
            >
              Lupa Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-semibold py-2.5 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors text-sm shadow-md"
          >
            LOGIN
          </button>
          <div className="text-center text-xs text-white opacity-90 mt-6">
            Belum punya akun?{" "}
            <Link to="/register" className="font-medium hover:underline">
              Daftar di sini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
