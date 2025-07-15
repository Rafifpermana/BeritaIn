import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import StatCard from "../../dashboard/users/StatCard";
import {
  Users,
  MessageSquare,
  ShieldAlert,
  FilePlus,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

const AnalyticsChart = ({ chartData, title, dataKey, barColor }) => {
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  return (
    <div className="mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
        Statistik {title} (7 Hari Terakhir)
      </h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatXAxis} fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar dataKey={dataKey} fill={barColor} name={title} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const { apiCall } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiCall("/admin/dashboard-stats");
        setDashboardData(data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [apiCall]);

  if (loading) {
    return <div>Memuat data overview...</div>;
  }

  if (!dashboardData || !dashboardData.stats) {
    return <div>Gagal memuat data. Silakan coba lagi nanti.</div>;
  }

  const { stats, charts } = dashboardData;

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
        <StatCard
          title="Total Pengguna"
          value={stats.total_users}
          Icon={Users}
          iconColorClass="text-blue-500"
        />
        <StatCard
          title="Total Komentar"
          value={stats.total_comments}
          Icon={MessageSquare}
          iconColorClass="text-indigo-500"
        />
        <StatCard
          title="Komentar Ditolak"
          value={stats.rejected_comments}
          Icon={ShieldAlert}
          iconColorClass="text-red-500"
        />
        <StatCard
          title="Artikel Lokal Baru (Mingguan)"
          value={stats.new_articles_this_week}
          Icon={FilePlus}
          iconColorClass="text-green-500"
        />
      </div>

      {charts?.users && (
        <AnalyticsChart
          chartData={charts.users}
          title="Pengguna Baru"
          dataKey="count"
          barColor="#3b82f6"
        />
      )}
      {charts?.comments && (
        <AnalyticsChart
          chartData={charts.comments}
          title="Komentar Baru"
          dataKey="count"
          barColor="#8b5cf6"
        />
      )}
    </div>
  );
};

export default AdminOverview;
