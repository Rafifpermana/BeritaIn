// src/dashboard/admin/BroadcastNotificationPage.jsx
import React, { useState } from "react";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import { Send, Megaphone } from "lucide-react";

const BroadcastNotificationPage = () => {
  const { broadcastAdminMessage } = useArticleInteractions();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      alert("Judul dan isi pesan tidak boleh kosong!");
      return;
    }
    broadcastAdminMessage(title, message);
    alert("Pengumuman telah dikirim ke semua pengguna (simulasi).");
    setTitle("");
    setMessage("");
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-6 pb-4 border-b">
        <Megaphone size={24} className="text-sky-600 mr-3" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Kirim Pengumuman ke Pengguna
        </h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Gunakan form ini untuk mengirim pesan atau pengumuman penting. Pesan
        akan muncul sebagai notifikasi untuk semua pengguna.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="broadcastTitle"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Judul Pengumuman
          </label>
          <input
            type="text"
            id="broadcastTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
            placeholder="Contoh: Pemeliharaan Sistem"
          />
        </div>
        <div>
          <label
            htmlFor="broadcastMessage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Isi Pengumuman
          </label>
          <textarea
            id="broadcastMessage"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-sm"
            placeholder="Tulis detail pengumuman Anda di sini..."
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            <Send size={16} />
            <span>Kirim Pengumuman</span>
          </button>
          {isSent && (
            <p className="text-sm text-green-600">Pengumuman terkirim!</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BroadcastNotificationPage;
