// src/pages/admin/AdminOverview.jsx
import React, { useState, useMemo, useCallback } from "react";
// Pastikan path impor StatCard benar sesuai struktur folder Anda
import StatCard from "../../dashboard/StatCard"; // Contoh path: ../../components/dashboard/StatCard
import { useArticleInteractions } from "../../hooks/useArticleInteractions"; // Pastikan path ini benar
import {
  allUsersData,
  allArticlesData,
  calculateTotalComments,
} from "../../data/mockData"; // Pastikan path ini benar
import {
  Users,
  FilePlus,
  FileText,
  MessageSquare,
  ShieldAlert, // Mengganti MessageCircleWarning
  BarChart3,
  TrendingUp,
  Eye,
} from "lucide-react";

// Komponen grafik placeholder
const AnalyticsChart = ({
  chartDataForPeriod,
  title,
  timePeriod,
  onTimePeriodChange,
}) => {
  // Data dummy dan label untuk placeholder chart
  const periodLabels = {
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    annually: "Tahunan",
  };

  // Anda bisa menambahkan struktur data yang lebih kompleks untuk library chart di sini
  // Misalnya, jika menggunakan Chart.js atau Recharts
  // const chartDisplayData = {
  //   labels: chartDataForPeriod?.labels || [], // Misal ['Sen', 'Sel', ...]
  //   datasets: [
  //     {
  //       label: title,
  //       data: chartDataForPeriod?.values || [], // Misal [12, 19, ...]
  //       borderColor: "rgb(54, 162, 235)",
  //       backgroundColor: "rgba(54, 162, 235, 0.5)",
  //     },
  //   ],
  // };

  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 sm:mb-0">
          Statistik {title}
        </h2>
        <div className="flex space-x-1">
          {["daily", "weekly", "monthly", "annually"].map((period) => (
            <button
              key={period}
              onClick={() => onTimePeriodChange(period)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors
                ${
                  timePeriod === period
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                }`}
            >
              {periodLabels[period]}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-72 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
        {/* Ganti placeholder ini dengan komponen chart Anda yang sebenarnya */}
        {chartDataForPeriod && chartDataForPeriod.length > 0 ? (
          <div className="text-center p-4">
            <BarChart3 size={36} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 text-sm">
              Menampilkan grafik untuk {title} ({periodLabels[timePeriod]})
            </p>
            <p className="text-xs text-gray-400 mt-1">
              (Data Sample: {chartDataForPeriod.join(", ")})
            </p>
            {/* Contoh jika menggunakan library chart: */}
            {/* <Line data={chartDisplayData} /> */}
          </div>
        ) : (
          <p className="text-gray-500">
            Pilih metrik untuk melihat data grafik.
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        *Data grafik saat ini adalah simulasi dan belum terhubung ke data
        backend realtime.
      </p>
    </div>
  );
};

const AdminOverview = () => {
  const { articleCommentsState } = useArticleInteractions();

  const [selectedChartMetric, setSelectedChartMetric] = useState(null);
  const [chartTimePeriod, setChartTimePeriod] = useState("weekly");
  const [fullChartDataForMetric, setFullChartDataForMetric] = useState({});

  const totalUsers = useMemo(() => {
    return allUsersData?.length || 0;
  }, []);

  const totalComments = useMemo(() => {
    if (!articleCommentsState) return 0;
    return Object.values(articleCommentsState).reduce((acc, comments) => {
      return acc + calculateTotalComments(comments || []);
    }, 0);
  }, [articleCommentsState]);

  const totalNegativeComments = useMemo(() => {
    if (!articleCommentsState) return 0;
    let count = 0;
    Object.values(articleCommentsState).forEach((commentsForArticle) => {
      const traverse = (commentList) => {
        if (!Array.isArray(commentList)) return;
        for (const comment of commentList) {
          if (!comment) continue;
          if (comment.status === "rejected") {
            count++;
          }
          if (comment.replies && comment.replies.length > 0) {
            traverse(comment.replies);
          }
        }
      };
      traverse(commentsForArticle || []);
    });
    return count;
  }, [articleCommentsState]);

  const newArticlesThisWeek = useMemo(() => {
    if (!allArticlesData) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const articlesArray = Object.values(allArticlesData);
    return articlesArray.filter((article) => {
      if (!article || !article.date) return false;
      return new Date(article.date) >= oneWeekAgo;
    }).length;
  }, []);

  const adminStats = [
    {
      id: "users",
      value: totalUsers.toString(),
      title: "Total Pengguna",
      Icon: Users,
      iconColorClass: "text-blue-500",
      isClickable: true,
    },
    {
      id: "comments",
      value: totalComments.toString(),
      title: "Total Komentar",
      Icon: MessageSquare,
      iconColorClass: "text-indigo-500",
      isClickable: true,
    },
    {
      id: "negativeComments",
      value: totalNegativeComments.toString(),
      title: "Komentar Ditolak",
      Icon: ShieldAlert,
      iconColorClass: "text-red-500",
      isClickable: true,
    },
    {
      id: "newArticles",
      value: newArticlesThisWeek.toString(),
      title: "Berita Baru (Mingguan)",
      Icon: FilePlus,
      iconColorClass: "text-green-500",
      isClickable: false,
    },
  ];

  const generateDummyChartDataForAllPeriods = useCallback(
    (metric) => {
      const baseValue =
        {
          users: totalUsers,
          comments: totalComments,
          negativeComments: totalNegativeComments,
        }[metric] || 10;

      const generateRandomData = (
        count,
        maxFactor = 0.1,
        minFactor = 0.03,
        isMonthly = false
      ) => {
        const maxVal = Math.max(
          Math.floor(baseValue * maxFactor),
          isMonthly ? 10 : 5
        );
        const minVal = Math.max(Math.floor(baseValue * minFactor), 1);
        // Pastikan minVal tidak lebih besar dari maxVal
        const actualMin = Math.min(minVal, maxVal - 1 < 0 ? 0 : maxVal - 1); // maxVal-1 agar ada range
        const actualMax = Math.max(minVal, maxVal);

        return Array.from({ length: count }, () =>
          Math.floor(Math.random() * (actualMax - actualMin + 1) + actualMin)
        );
      };
      return {
        daily: generateRandomData(7, 0.1, 0.03),
        weekly: generateRandomData(4, 0.25, 0.1),
        monthly: generateRandomData(12, 0.8, 0.2, true),
        annually: [
          Math.floor(baseValue * (Math.random() * 0.4 + 0.3)),
          baseValue,
        ],
      };
    },
    [totalUsers, totalComments, totalNegativeComments]
  );

  const handleStatCardClick = (metricId) => {
    if (metricId === "newArticles") return;
    if (selectedChartMetric === metricId) {
      setSelectedChartMetric(null);
      setFullChartDataForMetric({});
    } else {
      setSelectedChartMetric(metricId);
      setChartTimePeriod("weekly");
      setFullChartDataForMetric(generateDummyChartDataForAllPeriods(metricId));
    }
  };

  // Data yang akan dikirim ke komponen chart, berdasarkan timePeriod yang dipilih
  const currentPeriodChartData = useMemo(() => {
    if (!selectedChartMetric || !fullChartDataForMetric[chartTimePeriod]) {
      return [];
    }
    return fullChartDataForMetric[chartTimePeriod];
  }, [selectedChartMetric, chartTimePeriod, fullChartDataForMetric]);

  const getChartTitle = () => {
    const stat = adminStats.find((s) => s.id === selectedChartMetric);
    return stat ? stat.title : "";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Statistik dan ringkasan penting situs.
            </p>
          </div>
          <TrendingUp size={36} className="text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <div
            key={stat.id}
            onClick={() => stat.isClickable && handleStatCardClick(stat.id)}
            className={`${
              stat.isClickable
                ? "cursor-pointer transform hover:scale-105 transition-transform duration-200"
                : ""
            } ${
              selectedChartMetric === stat.id
                ? "ring-2 ring-blue-500 ring-opacity-75 shadow-blue-200/50 shadow-lg"
                : ""
            } rounded-xl`}
          >
            <StatCard
              value={stat.value}
              title={stat.title}
              Icon={stat.Icon}
              iconColorClass={stat.iconColorClass}
              description={stat.isClickable ? "Klik untuk lihat statistik" : ""}
              actionIcon={
                stat.isClickable ? (
                  <Eye
                    size={18}
                    className="text-gray-400 group-hover:text-blue-500"
                  />
                ) : null
              }
            />
          </div>
        ))}
      </div>

      {selectedChartMetric && (
        <AnalyticsChart
          title={getChartTitle()}
          chartDataForPeriod={currentPeriodChartData} // Mengirim array data untuk periode aktif
          timePeriod={chartTimePeriod}
          onTimePeriodChange={setChartTimePeriod}
        />
      )}
    </div>
  );
};

export default AdminOverview;
