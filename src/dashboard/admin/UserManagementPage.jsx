// src/dashboard/admin/UserManagementPage.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // <-- Impor useAuth
import { UserPlus, Trash2, Search, Shield, User } from "lucide-react";

const UserManagementPage = () => {
  // Gunakan state dan fungsi dari AuthContext, bukan state lokal
  const { allUsers, updateUserRole, deleteUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak bisa dibatalkan."
      )
    ) {
      deleteUser(userId);
    }
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Manajemen Pengguna
        </h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 flex items-center space-x-1.5">
            <UserPlus size={16} />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* --- DESAIN BARU MENGGUNAKAN DIV & FLEXBOX --- */}
      <div className="space-y-2">
        {/* Header Tabel */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase">
          <div className="col-span-3">Nama</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2 text-center">Peran</div>
          <div className="col-span-1 text-center">Poin</div>
          <div className="col-span-2 text-center">Bergabung</div>
          <div className="col-span-1 text-right">Aksi</div>
        </div>

        {/* Body Tabel */}
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border"
          >
            {/* Nama */}
            <div className="col-span-12 md:col-span-3 flex items-center">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
              </div>
            </div>
            {/* Email */}
            <div className="hidden md:block col-span-3 text-sm text-gray-600 truncate">
              {user.email}
            </div>
            {/* Peran */}
            <div className="col-span-6 md:col-span-2 flex items-center justify-center">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className={`text-xs p-1.5 rounded-md border focus:ring-2 ${
                  user.role === "admin"
                    ? "bg-sky-100 text-sky-800 border-sky-300 focus:ring-sky-500"
                    : "bg-gray-200 text-gray-800 border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {/* Poin */}
            <div className="col-span-6 md:col-span-1 text-center font-medium text-gray-700">
              {user.points}
            </div>
            {/* Tanggal Bergabung */}
            <div className="col-span-6 md:col-span-2 text-center text-sm text-gray-500">
              {new Date(user.joinDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            {/* Aksi */}
            <div className="col-span-6 md:col-span-1 flex justify-end">
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Pengguna tidak ditemukan.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
