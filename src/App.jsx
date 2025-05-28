import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar"; // Pastikan path ini benar
import Footer from "./components/Footer"; // Pastikan path ini benar
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"; // Asumsi sudah ada
import RegisterPage from "./pages/RegisterPage"; // Asumsi sudah ada
import DetailPage from "./pages/DetailPage"; // Tambahkan import DetailPage

// Layout dengan Navbar & Footer
const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    {" "}
    {/* Memberi warna latar dasar */}
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
          <Route path="/article/:articleId" element={<DetailPage />} />{" "}
          {/* Tambahkan route ini */}
          {/* Tambahkan route lain yang menggunakan MainLayout di sini 
              Contoh: <Route path="/category/:categoryName" element={<CategoryPage />} /> 
          */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
