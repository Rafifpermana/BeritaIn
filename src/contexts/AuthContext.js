// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { allUsersData as initialUsersData } from "../data/mockData";

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
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- STATE BARU UNTUK MENGELOLA SEMUA PENGGUNA ---
  // Ini memungkinkan data pengguna diubah (dihapus/di-update rolenya) secara dinamis
  const [allUsers, setAllUsers] = useState(initialUsersData);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setStoredUser(currentUser);
  }, [currentUser]);

  // --- FUNGSI BARU UNTUK MANAJEMEN PENGGUNA OLEH ADMIN ---
  const updateUserRole = (userId, newRole) => {
    setAllUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const deleteUser = (userId) => {
    setAllUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== userId)
    );
    // Jika admin menghapus akunnya sendiri, otomatis logout
    if (currentUser && currentUser.id === userId) {
      logout();
    }
  };
  // --- AKHIR FUNGSI BARU ---

  const updateUserProfile = (newData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...newData };
    setCurrentUser(updatedUser);
    // Juga update data di dalam list semua user
    setAllUsers((users) =>
      users.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
  };

  // Login function diperbarui untuk menggunakan state allUsers
  const login = (email, password) => {
    setError("");
    try {
      if (!email || !password)
        throw new Error("Email dan password harus diisi");

      // Menggunakan state 'allUsers' yang dinamis, bukan data statis
      const user = allUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) throw new Error("Email tidak ditemukan");
      if (password !== "password123") throw new Error("Password salah");

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

  // Register function diperbarui untuk menggunakan state allUsers
  const register = (email, username, password, confirmPassword) => {
    setError("");
    try {
      if (!email || !username || !password || !confirmPassword)
        throw new Error("Semua field harus diisi");
      if (password !== confirmPassword)
        throw new Error("Password dan konfirmasi password tidak cocok");
      if (password.length < 8)
        throw new Error("Password harus minimal 8 karakter");

      // Validasi menggunakan state 'allUsers'
      if (allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()))
        throw new Error("Email sudah terdaftar");
      if (
        allUsers.find(
          (u) =>
            u.username && u.username.toLowerCase() === username.toLowerCase()
        )
      )
        throw new Error("Username sudah digunakan");

      const newUser = {
        id: `user${allUsers.length + 1}${Math.random()}`, // Tambah random untuk ID unik
        username: username,
        name: username,
        email: email,
        role: "user",
        points: 0,
        avatar: `https://ui-avatars.com/api/?name=${username.replace(
          / /g,
          "+"
        )}&background=3498DB&color=fff`,
        joinDate: new Date().toISOString().split("T")[0],
      };

      // Tambahkan user baru ke state allUsers
      setAllUsers((currentUsers) => [...currentUsers, newUser]);

      setLoading(true);
      setTimeout(() => {
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

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  // --- VALUE DIPERBARUI DENGAN STATE & FUNGSI BARU ---
  const value = {
    currentUser,
    allUsers, // <-- state baru
    loading,
    error,
    login,
    register,
    logout,
    isAdmin,
    updateUserProfile,
    updateUserRole, // <-- fungsi baru
    deleteUser, // <-- fungsi baru
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};
