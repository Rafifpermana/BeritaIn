// src/pages/dashboard/DashboardOverview.jsx
import React from "react";
import StatCard from "../dashboard/StatCard"; // Sesuaikan path jika StatCard ada di ../../components/dashboard/
import {
  Star,
  Link2 as LinkIcon,
  Settings as SettingsIcon,
} from "lucide-react";

const DashboardOverview = () => {
  const statsData = [
    {
      value: "111",
      title: "Total Reviews",
      description: "10% increase from last week",
      Icon: Star,
      iconColorClass: "text-yellow-500",
    },
    {
      value: "55",
      title: "Articles Bookmarked",
      description: "5 new this week",
      Icon: LinkIcon,
      iconColorClass: "text-blue-500",
    },
    {
      value: "70",
      title: "Review Request Sent",
      description: "10% increase from last week",
      Icon: LinkIcon,
      iconColorClass: "text-green-500",
    },
    {
      value: "4.5",
      title: "Review Average",
      description: "Based on 111 reviews",
      Icon: SettingsIcon,
      iconColorClass: "text-purple-500",
    },
    {
      value: "10",
      title: "Accepted Feedback",
      description: "2 new this month",
      Icon: LinkIcon,
      iconColorClass: "text-red-500",
    },
  ];
  const userName = "Pengguna"; // Placeholder, idealnya dari state auth atau props

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Welcome to your dashboard, {userName}!
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            value={stat.value}
            title={stat.title}
            description={stat.description}
            Icon={stat.Icon}
            iconColorClass={stat.iconColorClass}
          />
        ))}
      </div>
      {/* Anda bisa menambahkan lebih banyak konten untuk overview dashboard di sini */}
      {/* <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
                <p className="text-gray-600 mt-2">...</p>
            </div> */}
    </>
  );
};

export default DashboardOverview;
