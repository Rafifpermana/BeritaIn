// src/pages/admin/UserManagementPage.jsx
import React, { useState } from "react";
import { allUsersData } from "../../data/mockData"; // Impor data pengguna
import {
  UserPlus,
  // Edit3, // Dihilangkan karena tombol Edit dihapus
  Trash2,
  // Shield, // Tidak digunakan secara langsung di sini
  // UserCheck, // Tidak digunakan secara langsung di sini
  Search,
} from "lucide-react";

const UserManagementPage = () => {
  const [users, setUsers] = useState(allUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  // TODO: State dan logika untuk modal tambah/edit pengguna bisa ditambahkan di sini

  const handleRoleChange = (userId, newRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    console.log(
      `Peran pengguna ${userId} diubah menjadi ${newRole} (simulasi)`
    );
    // TODO: Panggil API untuk update peran di backend
  };

  const handleDeleteUser = (userId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus pengguna ini? Pengguna yang terhapus tidak bisa dikembalikan."
      )
    ) {
      setUsers(users.filter((user) => user.id !== userId));
      console.log(`Pengguna ${userId} dihapus (simulasi)`);
      // TODO: Panggil API untuk hapus pengguna di backend
    }
  };

  // Fungsi placeholder untuk tombol Tambah Pengguna
  const handleAddUser = () => {
    console.log(
      "Tombol 'Tambah Pengguna' diklik. Implementasi modal/form tambah pengguna diperlukan."
    );
    alert(
      "Fungsi 'Tambah Pengguna' belum diimplementasikan sepenuhnya.\nIni akan membuka form untuk menambah pengguna baru."
    );
    // Di sini Anda bisa mengatur state untuk menampilkan modal form tambah pengguna
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) // Tambahkan filter berdasarkan peran
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Manajemen Pengguna
        </h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Cari nama, email, peran..."
              className="px-3 py-2 pl-8 border border-gray-300 rounded-md text-sm w-full focus:ring-sky-500 focus:border-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            onClick={handleAddUser} // Tambahkan onClick handler
            className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 flex items-center space-x-1.5"
          >
            <UserPlus size={16} />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Peran
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Poin
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tgl Bergabung
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center">
                    <img
                      src={user.avatarUrl || "/placeholder-avatar.png"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0" // Tambah flex-shrink-0
                    />
                    <span className="truncate" title={user.name}>
                      {user.name}
                    </span>{" "}
                    {/* Tambah truncate */}
                  </div>
                </td>
                <td
                  className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate"
                  title={user.email}
                >
                  {user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`p-1.5 rounded-md text-xs border focus:ring-2 focus:outline-none transition-colors
                      ${
                        user.role === "admin"
                          ? "bg-sky-100 text-sky-700 border-sky-300 focus:ring-sky-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {user.points}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {/* Pastikan user.joinDate ada dan valid */}
                  {user.joinDate
                    ? new Date(user.joinDate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  {/* Tombol Edit dihilangkan, hanya ada tombol Hapus */}
                  <button
                    title="Hapus Pengguna"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-800 p-1.5 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Tidak ada pengguna ditemukan atau cocok dengan pencarian.
          </p>
        )}
      </div>
    </div>
  );
};
export default UserManagementPage;
