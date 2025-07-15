import React from "react";
import { Link } from "react-router-dom";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

const UserNotificationsPage = () => {
  // Ambil fungsi deleteNotification dari context
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useArticleInteractions();

  // Urutkan notifikasi: yang belum dibaca di atas, lalu berdasarkan waktu terbaru
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read === b.read) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    return a.read ? 1 : -1;
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-3 sm:mb-0">
          <Bell size={28} className="text-blue-600 mr-3" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Semua Notifikasi
          </h1>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <CheckCheck size={16} className="mr-1.5" /> Tandai semua dibaca
          </button>
        )}
      </div>

      {sortedNotifications.length > 0 ? (
        <div className="space-y-3">
          {sortedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg border transition-colors ${
                !notif.read
                  ? "bg-blue-50 border-blue-200 shadow-sm"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              <div className="flex justify-between items-start">
                <Link
                  to={notif.link || "#"}
                  className="flex-grow"
                  onClick={() => {
                    if (!notif.read) markNotificationAsRead(notif.id);
                  }}
                >
                  <p
                    className={`text-sm mb-1 ${
                      !notif.read
                        ? "text-blue-800 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(notif.timestamp).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteNotification(notif.id);
                  }}
                  title="Hapus notifikasi"
                  className="ml-2 p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg sm:text-xl text-gray-700 font-semibold">
            Tidak Ada Notifikasi
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Anda akan melihat pembaruan penting di sini.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserNotificationsPage;
