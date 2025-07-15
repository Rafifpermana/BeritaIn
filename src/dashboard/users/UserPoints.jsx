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

const PointListItem = ({
  icon,
  title,
  points,
  description,
  isPositive = true,
}) => {
  const IconComponent = icon;
  const pointColor = isPositive ? "text-green-700" : "text-red-700";
  const iconColor = isPositive ? "text-green-600" : "text-red-600";
  const pointPrefix = isPositive ? "+" : "";

  return (
    <div className="flex items-start text-sm">
      <IconComponent
        size={18}
        className={`${iconColor} mr-3 mt-0.5 flex-shrink-0`}
      />
      <div>
        <span className="font-semibold text-gray-800">{title}:</span>
        <span className={`${pointColor} font-bold ml-2`}>
          ({pointPrefix}
          {points} Poin)
        </span>
        <p className="text-gray-600 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
};

const UserPointsPage = () => {
  const { currentUser } = useOutletContext();

  // Mengambil poin dari currentUser, dengan fallback jika data belum ada
  const currentUserPoints = currentUser?.points ?? 0;

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

      <div className="space-y-8">
        <section>
          <div className="flex items-center mb-3">
            <Info size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Tentang Sistem Poin
            </h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Poin adalah cerminan dari partisipasi dan kontribusi positif Anda di
            dalam komunitas. Poin yang cukup akan memberikan Anda hak untuk
            berinteraksi lebih jauh, seperti berkomentar di artikel. Jaga
            reputasi Anda dan teruslah berkontribusi secara positif!
          </p>
        </section>

        {/* --- Bagian Mendapatkan Poin --- */}
        <section>
          <div className="flex items-center mb-3">
            <TrendingUp size={20} className="text-green-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Cara Mendapatkan Poin (Contoh)
            </h2>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-4">
            <PointListItem
              icon={MessageCircle}
              title="Memberi Komentar"
              points={5}
              description="Berpartisipasi dalam diskusi yang membangun di setiap artikel."
              isPositive={true}
            />
            <PointListItem
              icon={ShieldCheck}
              title="Komentar Disetujui Admin"
              points={10}
              description="Jika komentar Anda yang sebelumnya ditinjau, kemudian disetujui oleh Admin."
              isPositive={true}
            />
            <PointListItem
              icon={TrendingUp}
              title="Komentar Anda Disukai"
              points={2}
              description="Setiap kali pengguna lain menyukai komentar Anda, menunjukkan kontribusi positif."
              isPositive={true}
            />
          </div>
        </section>

        {/* --- Bagian Pengurangan Poin --- */}
        <section>
          <div className="flex items-center mb-3">
            <TrendingDown size={20} className="text-red-500 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              Hal yang Dapat Mengurangi Poin
            </h2>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-4">
            <PointListItem
              icon={AlertTriangle}
              title="Komentar Ditolak/Dihapus"
              points={15}
              description="Komentar yang melanggar panduan komunitas akan dihapus dan poin dikurangi secara signifikan."
              isPositive={false}
            />
            <PointListItem
              icon={TrendingDown}
              title="Komentar Anda Tidak Disukai"
              points={1}
              description="Setiap kali pengguna lain tidak menyukai komentar Anda."
              isPositive={false}
            />
          </div>
        </section>

        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Jaga selalu etika dan berdiskusilah dengan sopan untuk pengalaman
            komunitas yang lebih baik.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Sistem poin dan detail aturan dapat berubah sewaktu-waktu sesuai
            kebijakan admin.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPointsPage;
