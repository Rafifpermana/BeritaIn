// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { allUsersData } from "../data/mockData";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to safely access localStorage
const getStoredUser = () => {
  if (typeof window !== "undefined") {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }
  return null;
};

const setStoredUser = (user) => {
  if (typeof window !== "undefined") {
    try {
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("currentUser");
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }
};

export const AuthProvider = ({ children }) => {
  // Cek localStorage untuk user yang sudah login sebelumnya
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize user from localStorage after component mounts
  useEffect(() => {
    const storedUser = getStoredUser();
    setCurrentUser(storedUser);
    setLoading(false);
  }, []);

  // Simpan user ke localStorage saat berubah
  useEffect(() => {
    setStoredUser(currentUser);
  }, [currentUser]);

  const updateUserProfile = (newData) => {
    if (!currentUser) return; // Tidak melakukan apa-apa jika tidak ada user

    // Gabungkan data lama dengan data baru
    const updatedUser = { ...currentUser, ...newData };

    // Perbarui state dan localStorage
    setCurrentUser(updatedUser);

    console.log("User profile updated in context:", updatedUser);
  };

  // Login function
  const login = (email, password) => {
    setError("");
    // Dalam aplikasi nyata, ini akan memanggil API
    // Untuk demo, kita gunakan data mock
    try {
      // Simulasi validasi sederhana
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }

      // Cari user berdasarkan email
      const user = allUsersData.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        throw new Error("Email tidak ditemukan");
      }

      // Dalam aplikasi nyata, kita akan memverifikasi password dengan bcrypt
      // Untuk demo, kita anggap password adalah "password123" untuk semua user
      if (password !== "password123") {
        throw new Error("Password salah");
      }

      // Simulasi delay seperti panggilan API asli
      setLoading(true);

      setTimeout(() => {
        setCurrentUser(user);
        setLoading(false);
      }, 500);

      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = (email, username, password, confirmPassword) => {
    setError("");
    try {
      // Validasi input
      if (!email || !username || !password || !confirmPassword) {
        throw new Error("Semua field harus diisi");
      }

      // Validasi password match
      if (password !== confirmPassword) {
        throw new Error("Password dan konfirmasi password tidak cocok");
      }

      // Validasi password strength (minimal 8 karakter)
      if (password.length < 8) {
        throw new Error("Password harus minimal 8 karakter");
      }

      // Cek apakah email sudah digunakan
      const existingEmailUser = allUsersData.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existingEmailUser) {
        throw new Error("Email sudah terdaftar");
      }

      // Cek apakah username sudah digunakan
      const existingUsernameUser = allUsersData.find(
        (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
      );
      if (existingUsernameUser) {
        throw new Error("Username sudah digunakan");
      }

      // Dalam aplikasi nyata, kita akan menyimpan user baru ke database
      // Untuk demo, kita buat user baru dengan ID unik
      const newUser = {
        id: `user${allUsersData.length + 1}`,
        username: username,
        name: username, // Gunakan username sebagai nama awal
        email: email,
        role: "user", // Default role adalah user
        points: 0,
        avatar: `https://ui-avatars.com/api/?name=${username.replace(
          / /g,
          "+"
        )}&background=3498DB&color=fff`,
        joinDate: new Date().toISOString().split("T")[0],
      };

      // Simulasi delay seperti panggilan API asli
      setLoading(true);

      setTimeout(() => {
        // Dalam aplikasi nyata, ini akan disimpan ke database
        // Untuk demo, kita langsung login dengan user baru
        setCurrentUser(newUser);
        setLoading(false);
      }, 500);

      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    updateUserProfile,
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};
