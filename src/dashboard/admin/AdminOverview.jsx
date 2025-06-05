// src/pages/admin/AdminOverview.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import StatCard from "../../dashboard/users/StatCard";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import {
  allUsersData,
  allArticlesData,
  calculateTotalComments,
} from "../../data/mockData";
import {
  Users,
  FileText,
  FilePlus,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Eye,
} from "lucide-react";

const AnalyticsChart = ({
  chartDataForPeriod,
  title,
  timePeriod,
  onTimePeriodChange,
}) => {
  const periodLabels = {
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    annually: "Tahunan",
  };
  return (
    <div className="mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-0">
          Statistik {title}
        </h2>
        <div className="flex space-x-1 self-start sm:self-center">
          {" "}
          {/* Tombol filter waktu */}
          {["daily", "weekly", "monthly", "annually"].map((period) => (
            <button
              key={period}
              onClick={() => onTimePeriodChange(period)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs rounded-md transition-colors ${
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
      <div className="w-full h-60 sm:h-72 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
        {chartDataForPeriod && chartDataForPeriod.length > 0 ? (
          <div className="text-center p-2 sm:p-4">
            <BarChart3
              size={30}
              sm={36}
              className="mx-auto text-gray-400 mb-2"
            />
            <p className="text-gray-600 text-xs sm:text-sm">
              Menampilkan grafik untuk {title} ({periodLabels[timePeriod]})
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              (Data Sample: {chartDataForPeriod.join(", ")})
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">
            Pilih metrik untuk melihat data grafik.
          </p>
        )}
      </div>
      <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 text-center">
        *Data grafik simulasi.
      </p>
    </div>
  );
};

const AdminOverview = () => {
  // ... (state dan logika useMemo, generateDummyChartData, handleStatCardClick, getChartTitle tetap sama)
  const { articleCommentsState } = useArticleInteractions();
  const [selectedChartMetric, setSelectedChartMetric] = useState(null);
  const [chartTimePeriod, setChartTimePeriod] = useState("weekly");
  const [fullChartDataForMetric, setFullChartDataForMetric] = useState({});
  const totalUsers = useMemo(() => allUsersData?.length || 0, []);
  const totalComments = useMemo(() => {
    if (!articleCommentsState) return 0;
    return Object.values(articleCommentsState).reduce(
      (acc, comments) => acc + calculateTotalComments(comments || []),
      0
    );
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
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Admin Overview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Statistik dan ringkasan penting situs.
            </p>
          </div>
          <TrendingUp
            size={32}
            className="text-blue-500 w-8 h-8 sm:w-9 sm:h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    size={16}
                    className="text-gray-400 group-hover:text-blue-500 w-4 h-4 sm:w-5 sm:h-5"
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
          chartDataForPeriod={currentPeriodChartData}
          timePeriod={chartTimePeriod}
          onTimePeriodChange={setChartTimePeriod}
        />
      )}
    </div>
  );
};
export default AdminOverview;
