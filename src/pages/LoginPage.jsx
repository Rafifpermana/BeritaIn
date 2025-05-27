import React, { useState } from "react";
import { User, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import logoMagang from "../assets/logo.png";

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
      {/* Background SVG */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          width="1280"
          height="720"
          viewBox="0 0 1280 720"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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

      {/* Logo */}
      <div className="relative z-10 mb-8">
        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-md">
          <span className="text-blue-700 font-bold">Logo</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm flex flex-col space-y-4"
      >
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white opacity-75" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
            className="w-full  bg-transparent border border-white text-white placeholder-white placeholder-opacity-70 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white opacity-75" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            className="w-full  bg-transparent border border-white text-white placeholder-white placeholder-opacity-70 px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-blue-700 font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
        >
          LOGIN
        </button>
        <div className="flex justify-between text-xs text-white opacity-80">
          <Link to="/register" className="hover:underline">
            Sign Up
          </Link>
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
