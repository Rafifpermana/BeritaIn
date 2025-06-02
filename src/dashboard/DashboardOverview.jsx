// src/pages/dashboard/DashboardOverview.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  UserCircle,
  KeyRound,
  ImageIcon,
  Save,
  ShieldCheck,
  Mail,
  BellRing,
  LockIcon as PrivacyIcon,
} from "lucide-react"; // Tambahkan ikon yang relevan
import { useOutletContext } from "react-router-dom"; // Impor useOutletContext

// --- Komponen Seksi Pengaturan (terpisah agar lebih rapi) ---
const ProfileSettingsSection = ({
  currentUsernameProp,
  onUsernameUpdate,
  currentAvatarProp,
  onAvatarUpdate,
  currentUserEmail,
}) => {
  const [usernameInput, setUsernameInput] = useState(currentUsernameProp);
  const [profileImagePreview, setProfileImagePreview] =
    useState(currentAvatarProp);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUsernameInput(currentUsernameProp);
  }, [currentUsernameProp]);

  useEffect(() => {
    setProfileImagePreview(currentAvatarProp);
  }, [currentAvatarProp]);

  const handleProfileInfoSubmit = (e) => {
    e.preventDefault();
    onUsernameUpdate(usernameInput);
    alert("Informasi profil berhasil diperbarui (simulasi).");
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
        onAvatarUpdate(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
      // alert("Foto profil telah dipilih (simulasi). Proses unggah belum diimplementasikan."); // Alert bisa dipindah setelah onAvatarUpdate
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <UserCircle size={24} className="mr-3 text-blue-600" /> Profil Saya
      </h2>
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-3">Foto Profil</h3>
        <div className="flex items-center space-x-4">
          <img
            src={profileImagePreview}
            alt="Foto Profil"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
              id="profileImageUpload"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ImageIcon size={16} />
              <span>Unggah Foto</span>
            </button>
            <p className="text-xs text-gray-500 mt-1.5">
              JPG, GIF atau PNG. Maks 1MB.
            </p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-3">
          Informasi Dasar
        </h3>
        <form onSubmit={handleProfileInfoSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Username
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                id="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="email"
                id="email"
                value={currentUserEmail}
                readOnly
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500"
              />
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            >
              <Save size={16} className="mr-2" /> Simpan Informasi
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const SecuritySettingsSection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState({
    type: "",
    text: "",
  });

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    setPasswordChangeMessage({ type: "", text: "" });
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage({
        type: "error",
        text: "Password baru dan konfirmasi tidak cocok!",
      });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordChangeMessage({
        type: "error",
        text: "Password baru minimal 8 karakter.",
      });
      return;
    }
    // TODO: Logika validasi password saat ini dan simpan password baru ke backend
    console.log("Permintaan ubah password:", { currentPassword, newPassword });
    setPasswordChangeMessage({
      type: "success",
      text: "Password berhasil diubah (simulasi)!",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <KeyRound size={24} className="mr-3 text-orange-500" /> Akun & Keamanan
      </h2>
      <h3 className="text-md font-medium text-gray-700 mb-3">Ubah Password</h3>
      <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Password Saat Ini
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan password lama Anda"
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
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:ring-1 ${
                passwordChangeMessage.type === "error" &&
                (newPassword || confirmNewPassword)
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Minimal 8 karakter"
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
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:ring-1 ${
                passwordChangeMessage.type === "error"
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              placeholder="Ulangi password baru"
            />
          </div>
        </div>
        {passwordChangeMessage.text && (
          <p
            className={`text-xs mt-1 ${
              passwordChangeMessage.type === "error"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {passwordChangeMessage.text}
          </p>
        )}
        <div className="pt-2">
          <button
            type="submit"
            className="flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
          >
            <ShieldCheck size={16} className="mr-2" /> Ubah Password
          </button>
        </div>
      </form>
    </section>
  );
};

const PreferencesPlaceholder = () => (
  <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <BellRing size={24} className="mr-3 text-purple-500" /> Preferensi
      Notifikasi
    </h2>
    <p className="text-sm text-gray-600">
      Pengaturan untuk preferensi notifikasi (email, push notification, dll.)
      akan tersedia di sini di masa mendatang.
    </p>
  </section>
);

const PrivacyPlaceholder = () => (
  <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <PrivacyIcon size={24} className="mr-3 text-gray-500" /> Privasi & Data
    </h2>
    <p className="text-sm text-gray-600">
      Pengaturan terkait privasi akun, pengelolaan data pribadi Anda, dan opsi
      ekspor atau penghapusan data akan tersedia di sini.
    </p>
  </section>
);

const DashboardOverview = () => {
  const context = useOutletContext(); // Ambil semua context dari Outlet
  if (!context) {
    // Jika context belum tersedia (misalnya saat UserDashboardPage belum sepenuhnya render)
    return <div className="p-6 text-center">Memuat pengaturan...</div>; // Atau tampilan loading lain
  }
  const {
    currentUsername,
    currentAvatar,
    onUsernameUpdate,
    onAvatarUpdate,
    currentUserEmail,
  } = context;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="pb-4 mb-4 border-b border-gray-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Pengaturan Akun Saya
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola informasi profil, keamanan, dan preferensi akun Anda di sini.
        </p>
      </div>
      <ProfileSettingsSection
        currentUsernameProp={currentUsername}
        onUsernameUpdate={onUsernameUpdate}
        currentAvatarProp={currentAvatar}
        onAvatarUpdate={onAvatarUpdate}
        currentUserEmail={currentUserEmail}
      />
      <SecuritySettingsSection />
      <PreferencesPlaceholder />
      <PrivacyPlaceholder />
    </div>
  );
};
export default DashboardOverview;
