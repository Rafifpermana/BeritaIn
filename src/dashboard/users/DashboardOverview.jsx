import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { UserCircle, KeyRound, Save, Mail, ShieldCheck } from "lucide-react";
import UserAvatar from "../../components/UserAvatar";

// Komponen ProfileSettingsSection
const ProfileSettingsSection = ({ currentUser, onUpdateProfile }) => {
  const [usernameInput, setUsernameInput] = useState(currentUser.name || "");

  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    setUsernameInput(currentUser.name || "");
  }, [currentUser.name]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback({ type: "", text: "" });
    }, 3000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (usernameInput !== currentUser.name) {
      formData.append("name", usernameInput);
    }

    if (formData.entries().next().done) {
      showFeedback("error", "Tidak ada perubahan untuk disimpan.");
      return;
    }

    try {
      await onUpdateProfile(formData);
      showFeedback("success", "Profil berhasil diperbarui!");
    } catch (error) {
      showFeedback("error", "Gagal memperbarui profil.");
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <UserCircle size={24} className="mr-3 text-blue-600" /> Profil Saya
      </h2>
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Foto Profil
          </h3>
          <div className="flex items-center space-x-4">
            <UserAvatar
              name={currentUser.name}
              size="w-20 h-20 sm:w-24 sm:h-24"
            />
            <p className="text-xs text-gray-500 mt-1">
              Avatar otomatis berdasarkan nama Anda
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Username
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Email{" "}
            <span className="text-xs text-gray-400">(tidak dapat diubah)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              value={currentUser.email}
              readOnly
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <Save size={16} className="mr-2" /> Simpan Perubahan
          </button>
          {feedback.text && (
            <p
              className={`text-sm font-medium transition-opacity duration-300 mt-2 ${
                feedback.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback.text}
            </p>
          )}
        </div>
      </form>
    </section>
  );
};

// Komponen SecuritySettingsSection (terhubung dengan backend)
const SecuritySettingsSection = ({ onUpdatePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmNewPassword) {
      setMessage({
        type: "error",
        text: "Password baru dan konfirmasi tidak cocok!",
      });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password baru minimal 8 karakter." });
      return;
    }

    try {
      await onUpdatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmNewPassword,
      });
      setMessage({
        type: "success",
        text: "Password berhasil diubah!",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      const errorMsg = error.message || "Gagal mengubah password.";
      setMessage({
        type: "error",
        text: errorMsg,
      });
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <KeyRound size={24} className="mr-3 text-orange-500" /> Akun & Keamanan
      </h2>
      <h3 className="text-md font-medium text-gray-700 mb-3">Ubah Password</h3>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Password Saat Ini
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Password Baru
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
        {message.text && (
          <p
            className={`text-xs mt-1 ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            <ShieldCheck size={16} className="mr-2" /> Ubah Password
          </button>
        </div>
      </form>
    </section>
  );
};

// Komponen utama
const DashboardOverview = () => {
  const { currentUser, updateUserProfile, updatePassword } = useOutletContext();

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-gray-500">
        Memuat data pengguna...
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="pb-4 mb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Selamat datang di Dashboard, {currentUser.name}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola informasi profil dan keamanan akun Anda di sini.
        </p>
      </div>

      <ProfileSettingsSection
        currentUser={currentUser}
        onUpdateProfile={updateUserProfile}
      />

      <SecuritySettingsSection onUpdatePassword={updatePassword} />
    </div>
  );
};

export default DashboardOverview;
