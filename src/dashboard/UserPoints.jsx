// src/pages/dashboard/UserPointsPage.jsx
import React from "react";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

const UserPointsPage = () => {
  const context = useOutletContext();
  // Beri nilai default jika context atau currentUserPoints belum ada
  const currentUserPoints = context?.currentUserPoints ?? 0;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <Award size={32} className="text-indigo-600 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Informasi Poin Anda
          </h1>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <p className="text-xs text-gray-500 mb-0.5">
            Total Poin Anda Saat Ini
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
            {currentUserPoints}{" "}
            <span className="text-lg sm:text-xl font-semibold text-gray-500">
              poin
            </span>
          </p>
        </div>
      </div>
      {/* ... (Sisa konten UserPointsPage tetap sama seperti respons sebelumnya) ... */}
      <div className="space-y-8">
        <section>
          <div className="flex items-center mb-3">
            <Info size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Tentang Sistem Poin
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Poin adalah cerminan dari partisipasi dan kontribusi positif Anda...
          </p>
        </section>
        <section>
          <div className="flex items-center mb-3">
            <TrendingUp size={20} className="text-green-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Cara Mendapatkan Poin (Contoh)
            </h2>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-2">
            {/* ... (item mendapatkan poin) ... */}
          </div>
        </section>
        <section>
          <div className="flex items-center mb-3">
            <TrendingDown size={20} className="text-red-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Hal yang Dapat Mengurangi Poin
            </h2>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
            {/* ... (item pengurangan poin) ... */}
          </div>
        </section>
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">Jaga selalu etika...</p>
          <p className="mt-2 text-xs text-gray-500">
            Sistem poin dan detail aturan...
          </p>
        </div>
      </div>
    </div>
  );
};
export default UserPointsPage;
