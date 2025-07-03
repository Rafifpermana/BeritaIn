import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserPlus, Trash2, Search } from "lucide-react";

const UserManagementPage = () => {
  const { apiCall, currentUser } = useAuth(); // Ambil apiCall dan data admin yang sedang login
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // state untuk paginasi, jika Anda ingin mengembangkannya nanti
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // Fungsi utama untuk mengambil data pengguna dari backend
  const fetchUsers = useCallback(
    async (pageNum = 1, search = "") => {
      setLoading(true);
      try {
        // Tentukan endpoint berdasarkan apakah ada query pencarian atau tidak
        let endpoint = search
          ? `/admin/users/search?q=${search}&page=${pageNum}`
          : `/admin/users?page=${pageNum}`;

        const data = await apiCall(endpoint);
        setUsers(data.data || []); // Data pengguna ada di dalam properti 'data' dari paginasi Laravel
        setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
        });
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
        setUsers([]); // Kosongkan data jika terjadi error
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchUsers(page);
  }, [fetchUsers, page]);

  // Handler untuk mengubah peran pengguna
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Panggil endpoint BARU yang spesifik untuk mengubah peran
      await apiCall(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }), // Hanya kirim data 'role'
      });
      // Refresh data untuk menampilkan perubahan
      fetchUsers(page, searchTerm);
    } catch (error) {
      alert(`Gagal mengubah peran: ${error.message}`);
    }
  };

  // Handler untuk menghapus pengguna
  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak bisa dibatalkan."
      )
    ) {
      try {
        await apiCall(`/admin/users/${userId}`, { method: "DELETE" });
        // Refresh data setelah berhasil
        fetchUsers(page, searchTerm);
      } catch (error) {
        alert(`Gagal menghapus pengguna: ${error.message}`);
      }
    }
  };

  // Handler untuk form pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Selalu reset ke halaman pertama saat melakukan pencarian baru
    fetchUsers(1, searchTerm);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">
          Manajemen Pengguna
        </h1>
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
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
          {/* Tombol Tambah bisa diaktifkan nanti jika ada fiturnya */}
          <button
            type="button"
            className="bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-sky-700 flex items-center space-x-1.5"
            disabled
          >
            <UserPlus size={16} />
            <span>Tambah</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-10">Memuat pengguna...</div>
      ) : (
        <div className="space-y-2">
          {/* Header Tabel */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase">
            <div className="col-span-3">Nama</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2 text-center">Peran</div>
            <div className="col-span-2 text-center">Poin</div>
            <div className="col-span-1 text-center">Bergabung</div>
            <div className="col-span-1 text-right">Aksi</div>
          </div>

          {/* Body Tabel */}
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg border"
            >
              <div className="col-span-12 md:col-span-3 flex items-center">
                <img
                  // Bagian ini mengambil avatar dari setiap 'user' yang sedang di-loop
                  src={
                    user.avatar_url ||
                    `https://ui-avatars.com/api/?name=${user.name.replace(
                      /\s/g,
                      "+"
                    )}&background=random`
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 md:hidden">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="hidden md:block col-span-3 text-sm text-gray-600 truncate">
                {user.email}
              </div>
              <div className="col-span-6 md:col-span-2 flex items-center justify-center">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={currentUser.id === user.id}
                  className={`text-xs p-1.5 rounded-md border focus:ring-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                    user.role === "admin"
                      ? "bg-sky-100 text-sky-800 border-sky-300 focus:ring-sky-500"
                      : "bg-gray-200 text-gray-800 border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-span-6 md:col-span-2 text-center font-medium text-gray-700">
                {user.points}
              </div>
              <div className="col-span-6 md:col-span-1 text-center text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="col-span-6 md:col-span-1 flex justify-end">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={currentUser.id === user.id}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              Pengguna tidak ditemukan.
            </p>
          )}
        </div>
      )}

      {/* Di sini Anda bisa menambahkan komponen Paginasi jika diperlukan, menggunakan data dari `pagination` state */}
    </div>
  );
};

export default UserManagementPage;
