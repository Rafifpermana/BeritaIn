import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api";

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
      console.error("Error reading user from localStorage:", error);
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
      console.error("Error writing user to localStorage:", error);
    }
  }
};

const getStoredToken = () => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("authToken");
    } catch (error) {
      console.error("Error reading token from localStorage:", error);
      return null;
    }
  }
  return null;
};

const setStoredToken = (token) => {
  if (typeof window !== "undefined") {
    try {
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Error writing token to localStorage:", error);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      try {
        // Verify token and get fresh user data
        const userData = await apiCall("/user");
        setCurrentUser(userData);

        // If user is admin, fetch all users
        if (userData.role === "admin") {
          await fetchAllUsers();
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // Clear invalid session
        logout();
      }
    }
    setLoading(false);
  };

  // Fungsi pembantu untuk semua panggilan API
  const apiCall = async (endpoint, options = {}) => {
    setError("");
    try {
      const token = getStoredToken();
      const headers = {
        Accept: "application/json",
        ...(options.headers || {}),
      };
      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || "GET",
        headers,
        body: options.body,
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMessage = data.message || "API call failed";
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join(" ");
        }
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fetch all users (for admin)
  const fetchAllUsers = async () => {
    try {
      const response = await apiCall("/admin/users");
      setAllUsers(response.data || response.users || response);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setAllUsers([]);
    }
  };

  // Login function
  const login = async (email, password) => {
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Email dan password harus diisi");
      }

      const data = await apiCall("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Set auth data
      setCurrentUser(data.user);
      setStoredUser(data.user);
      setStoredToken(data.access_token);

      // Fetch all users if admin
      if (data.user.role === "admin") {
        await fetchAllUsers();
      }

      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      return null;
    }
  };

  // Register function
  const register = async (name, email, password, password_confirmation) => {
    setError("");
    setLoading(true);

    try {
      if (!email || !name || !password || !password_confirmation) {
        throw new Error("Semua field harus diisi");
      }
      if (password !== password_confirmation) {
        throw new Error("Password dan konfirmasi password tidak cocok");
      }
      if (password.length < 8) {
        throw new Error("Password harus minimal 8 karakter");
      }

      // Register user
      await apiCall("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      // Auto login after successful registration
      const user = await login(email, password);
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      return null;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = getStoredToken();
      if (token) {
        await apiCall("/logout", { method: "POST" });
      }
    } catch (err) {
      console.error(
        "Logout API call failed, but clearing session anyway:",
        err
      );
    } finally {
      setCurrentUser(null);
      setAllUsers([]);
      setStoredUser(null);
      setStoredToken(null);
    }
  };

  // Update user profile
  const updateUserProfile = async (formData) => {
    if (!currentUser) return;

    try {
      const response = await apiCall(`/user/profile`, {
        method: "POST",
        body: formData,
      });

      const updatedUser = response.user;
      setCurrentUser(updatedUser);
      setStoredUser(updatedUser);

      if (isAdmin()) {
        setAllUsers((users) =>
          users.map((u) => (u.id === currentUser.id ? updatedUser : u))
        );
      }

      return updatedUser;
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
      throw error;
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const response = await apiCall("/user/password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      });
      return response;
    } catch (error) {
      console.error("Gagal mengubah password:", error);
      throw error;
    }
  };

  // Update user role (admin only)
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await apiCall(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      // Refresh users list
      await fetchAllUsers();

      return response;
    } catch (error) {
      console.error("Failed to update user role:", error);
      throw error;
    }
  };

  // Delete user (admin only)
  const deleteUser = async (userId) => {
    try {
      await apiCall(`/users/${userId}`, {
        method: "DELETE",
      });

      // Remove from local state
      setAllUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId)
      );

      // If admin deletes their own account, logout
      if (currentUser && currentUser.id === userId) {
        logout();
      }

      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    try {
      const response = await apiCall(`/users/${userId}`);
      return response.user || response.data || response;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  };

  // Search users (admin only)
  const searchUsers = async (searchTerm) => {
    try {
      const response = await apiCall(
        `/users/search?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data || response.users || response;
    } catch (error) {
      console.error("Failed to search users:", error);
      throw error;
    }
  };

  // Get user statistics (admin only)
  const getUserStats = async () => {
    try {
      const response = await apiCall("/users/stats");
      return response.data || response;
    } catch (error) {
      console.error("Failed to get user stats:", error);
      throw error;
    }
  };

  // Refresh current user data
  const refreshUser = async () => {
    if (!currentUser) return;

    try {
      const response = await apiCall("/user");
      const updatedUser = response.user || response.data || response;
      setCurrentUser(updatedUser);
      setStoredUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  // Refresh all users (admin only)
  const refreshAllUsers = async () => {
    if (!isAdmin()) return;

    try {
      await fetchAllUsers();
    } catch (error) {
      console.error("Failed to refresh users:", error);
      throw error;
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  // Check if current user is specific user
  const isCurrentUser = (userId) => {
    return currentUser?.id === userId;
  };

  // Get current user permissions
  const getUserPermissions = () => {
    if (!currentUser) return [];

    const basePermissions = ["read_profile", "update_profile"];

    if (currentUser.role === "admin") {
      return [
        ...basePermissions,
        "manage_users",
        "delete_users",
        "view_all_users",
        "manage_system",
      ];
    }

    if (currentUser.role === "moderator") {
      return [...basePermissions, "manage_content", "view_reports"];
    }

    return basePermissions;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return getUserPermissions().includes(permission);
  };

  const value = {
    // State
    currentUser,
    setCurrentUser,
    allUsers,
    loading,
    error,

    // Auth functions
    login,
    register,
    logout,

    // User management
    updateUserProfile,
    updatePassword,
    updateUserRole,
    deleteUser,
    getUserById,
    searchUsers,
    getUserStats,

    // Utility functions
    refreshUser,
    refreshAllUsers,
    isAdmin,
    isCurrentUser,
    getUserPermissions,
    hasPermission,

    // API helper
    apiCall,
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};
