// src/pages/admin/AdminOverview.jsx
import React from "react";
import StatCard from "../StatCard"; // Asumsi StatCard bisa dipakai ulang
import {
  Users,
  FileText,
  MessageSquare,
  MessageCircleWarning,
} from "lucide-react";

const AdminOverview = () => {
  // Data statistik admin contoh
  const adminStats = [
    {
      value: "1250",
      title: "Total Pengguna Terdaftar",
      Icon: Users,
      iconColorClass: "text-blue-500",
    },
    {
      value: "850",
      title: "Total Artikel Dipublikasi",
      Icon: FileText,
      iconColorClass: "text-green-500",
    },
    {
      value: "3500",
      title: "Total Komentar",
      Icon: MessageSquare,
      iconColorClass: "text-indigo-500",
    },
    {
      value: "15",
      title: "Komentar Menunggu Moderasi",
      Icon: MessageCircleWarning,
      iconColorClass: "text-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Statistik dan ringkasan penting situs.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat, index) => (
          <StatCard
            key={index}
            value={stat.value}
            title={stat.title}
            Icon={stat.Icon}
            iconColorClass={stat.iconColorClass}
            description="" // Deskripsi bisa dikosongkan atau diisi sesuai kebutuhan
          />
        ))}
      </div>
      {/* Tambahkan komponen atau informasi lain yang relevan untuk overview admin */}
    </div>
  );
};
export default AdminOverview;
