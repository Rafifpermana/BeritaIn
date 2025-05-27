import React from "react";
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

// Layout dengan Navbar & Footer
const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Outlet /> {/* Tempat konten halaman berubah */}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes tanpa layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes utama dengan navbar & footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          {/* Tambahkan route lain di sini */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
