// src/pages/admin/UserManagementPage.jsx
import React, { useState } from "react";
import { allUsersData } from "../../data/mockData"; // Impor data pengguna
import {
  UserPlus,
  Edit3,
  Trash2,
  Shield,
  UserCheck,
  Search,
} from "lucide-react";

const UserManagementPage = () => {
  const [users, setUsers] = useState(allUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  // TODO: State untuk modal tambah user, edit user

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
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      setUsers(users.filter((user) => user.id !== userId));
      console.log(`Pengguna ${userId} dihapus (simulasi)`);
      // TODO: Panggil API untuk hapus pengguna di backend
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Manajemen Pengguna
        </h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="px-3 py-2 pl-8 border border-gray-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <button className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 flex items-center space-x-1.5">
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
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    {user.name}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`p-1.5 rounded-md text-xs border ${
                      user.role === "admin"
                        ? "bg-sky-100 text-sky-700 border-sky-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
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
                  {new Date(user.joinDate).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    title="Edit Pengguna"
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    title="Hapus Pengguna"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Tidak ada pengguna ditemukan.
          </p>
        )}
      </div>
    </div>
  );
};
export default UserManagementPage;
