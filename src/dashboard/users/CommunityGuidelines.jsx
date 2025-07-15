import React from "react";
import { ShieldAlert, MessageCircle, UserX, ThumbsDown } from "lucide-react";
const CommunityGuidelines = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
      <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
        <ShieldAlert size={28} className="text-orange-500 mr-3" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Panduan Komunitas & Aturan Berkomentar
        </h1>
      </div>

      <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
        <p>
          Selamat datang di komunitas kami! Kami ingin memastikan platform ini
          menjadi tempat yang aman, nyaman, dan konstruktif bagi semua pengguna
          untuk berdiskusi dan berbagi pendapat. Untuk itu, kami meminta Anda
          untuk mematuhi panduan berikut saat berinteraksi, terutama dalam
          memberikan komentar:
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
          Jaga Etika Berkomentar
        </h2>
        <ul>
          <li>
            <strong className="font-medium">Hindari Ujaran Kebencian:</strong>{" "}
            Dilarang keras menggunakan kata-kata kasar, merendahkan, menyerang
            individu atau kelompok berdasarkan ras, etnis, agama, gender,
            orientasi seksual, atau disabilitas.
          </li>
          <li>
            <strong className="font-medium">
              Tidak Ada Komentar Negatif Berlebihan:
            </strong>{" "}
            Kritik yang konstruktif diperbolehkan, tetapi hindari komentar yang
            bersifat menyerang secara personal, memprovokasi, atau menyebarkan
            negativitas tanpa dasar.
          </li>
          <li>
            <strong className="font-medium">Hormati Perbedaan Pendapat:</strong>{" "}
            Diskusi yang sehat melibatkan berbagai sudut pandang. Hargai
            pendapat orang lain meskipun Anda tidak setuju.
          </li>
          <li>
            <strong className="font-medium">Jaga Privasi:</strong> Jangan
            membagikan informasi pribadi orang lain tanpa izin.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
          Konten yang Dilarang
        </h2>
        <div className="flex items-start space-x-3 my-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <UserX size={24} className="text-red-500 flex-shrink-0 mt-1" />
          <p className="text-red-700">
            Komentar yang mengandung spam, promosi tidak relevan, pornografi,
            kekerasan eksplisit, atau aktivitas ilegal akan dihapus dan akun
            yang melanggar dapat dikenakan sanksi.
          </p>
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
          Peran Admin
        </h2>
        <div className="flex items-start space-x-3 my-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <MessageCircle
            size={24}
            className="text-blue-500 flex-shrink-0 mt-1"
          />
          <p className="text-blue-700">
            Admin berhak untuk memoderasi, mengedit, atau menghapus komentar
            yang dianggap melanggar panduan ini tanpa pemberitahuan sebelumnya.
            Keputusan admin bersifat final. Pelanggaran berulang dapat
            menyebabkan pembatasan akses atau pemblokiran akun.
          </p>
        </div>

        <p className="mt-6">
          Tujuan kami adalah menciptakan ruang diskusi yang positif dan
          bermanfaat. Terima kasih atas kerja sama Anda dalam menjaga kenyamanan
          bersama.
        </p>

        <p className="mt-4 text-xs text-gray-500">
          Panduan ini dapat diperbarui sewaktu-waktu oleh admin.
        </p>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
