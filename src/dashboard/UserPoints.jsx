// src/pages/dashboard/UserPointsPage.jsx
import React, { useState } from "react";
// Impor semua ikon yang digunakan dari lucide-react
import {
  Award,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

const UserPoints = () => {
  // Contoh state poin, idealnya ini diambil dari data pengguna global atau API
  const [currentUserPoints, setCurrentUserPoints] = useState(85); // Contoh nilai poin

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      {" "}
      {/* Card utama dengan shadow dan border halus */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-4 sm:mb-0">
          <Award size={32} className="text-indigo-600 mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Poin Saya
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
      <div className="space-y-8">
        {" "}
        {/* Memberi jarak antar seksi utama */}
        {/* Seksi Bagaimana Poin Bekerja */}
        <section>
          <div className="flex items-center mb-3">
            <Info size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Tentang Sistem Poin
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Poin adalah cerminan dari partisipasi dan kontribusi positif Anda
            dalam komunitas BeritaIn. Poin yang tinggi menunjukkan reputasi yang
            baik dan kepatuhan terhadap panduan berkomentar kami. Jaga terus
            kualitas interaksi Anda!
          </p>
        </section>
        {/* Seksi Mendapatkan Poin */}
        <section>
          <div className="flex items-center mb-3">
            <TrendingUp size={20} className="text-green-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Cara Mendapatkan Poin (Contoh)
            </h2>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-2">
            <div className="flex items-start">
              <MessageCircle
                size={18}
                className="text-green-600 mr-2.5 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-green-800">
                Memberikan komentar yang membangun, informatif, dan bermanfaat
                bagi pengguna lain.
              </p>
            </div>
            <div className="flex items-start">
              <ShieldCheck
                size={18}
                className="text-green-600 mr-2.5 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-green-800">
                Melaporkan konten atau komentar yang melanggar aturan komunitas
                secara akurat.
              </p>
            </div>
            <div className="flex items-start">
              <Award
                size={18}
                className="text-green-600 mr-2.5 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-green-800">
                Partisipasi aktif dalam diskusi yang positif dan menghargai
                perbedaan pendapat.
              </p>
            </div>
            <p className="text-xs text-green-700 pt-2">
              (Detail lebih lanjut dan cara lain untuk mendapatkan poin akan
              diinformasikan oleh Admin.)
            </p>
          </div>
        </section>
        {/* Seksi Pengurangan Poin */}
        <section>
          <div className="flex items-center mb-3">
            <TrendingDown size={20} className="text-red-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Hal yang Dapat Mengurangi Poin
            </h2>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
            <p className="text-sm text-red-800 mb-2">
              Poin Anda dapat dikurangi jika terdeteksi melakukan pelanggaran
              terhadap panduan komunitas. Beberapa contoh perilaku yang dapat
              menyebabkan pengurangan poin:
            </p>
            <div className="flex items-start">
              {/* Ini adalah baris 118 yang error jika AlertTriangle tidak diimpor */}
              <AlertTriangle
                size={18}
                className="text-red-600 mr-2.5 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-red-800">
                Memberikan komentar negatif berlebihan, kasar, provokatif, atau
                mengandung ujaran kebencian.
              </p>
            </div>
            <div className="flex items-start">
              <AlertTriangle
                size={18}
                className="text-red-600 mr-2.5 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-red-800">
                Melakukan spamming, promosi tidak relevan, atau menyebarkan
                informasi palsu.
              </p>
            </div>
            <div className="flex items-start">
              <AlertTriangle
                size={18}
                className="text-red-600 mr-2.5 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-red-800">
                Melanggar privasi pengguna lain atau melakukan tindakan
                intimidasi.
              </p>
            </div>
            <div className="flex items-start">
              <AlertTriangle
                size={18}
                className="text-red-600 mr-2.5 mt-0.5 flex-shrink-0"
              />
              <p className="text-sm text-red-800">
                Perilaku toksik lainnya yang mengganggu kenyamanan dan
                integritas komunitas.
              </p>
            </div>
            <p className="text-xs text-red-700 pt-2">
              Keputusan terkait pengurangan poin akan dilakukan oleh Tim Admin
              berdasarkan peninjauan yang adil dan objektif.
            </p>
          </div>
        </section>
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Jaga selalu etika dan kontribusi positif Anda untuk pengalaman
            terbaik bersama BeritaIn.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Sistem poin dan detail aturan dapat diperbarui sewaktu-waktu oleh
            Admin.
          </p>
        </div>
      </div>
    </div>
  );
};

// Pastikan nama komponen diekspor dengan benar (UserPointsPage vs UserPoints)
export default UserPoints;
