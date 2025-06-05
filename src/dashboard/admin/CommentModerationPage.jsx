// src/pages/admin/CommentModerationPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { initialCommentsData, allArticlesData } from "../../data/mockData";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import {
  MessageCircleWarning,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  Send,
  AlertTriangle,
} from "lucide-react";

// Fungsi containsBadWords
const containsBadWords = (text) => {
  if (typeof text !== "string") return false;
  const badWords = [
    "jelek",
    "buruk",
    "bodoh",
    "spam",
    "kasar",
    "anjing",
    "bangsat",
    "kontol",
    "memek",
    "asu",
    "goblok", // Sesuaikan daftar kata kunci
  ];
  const lowerText = text.toLowerCase();
  return badWords.some((word) => lowerText.includes(word));
};

// Komponen Modal untuk Aksi Admin
const AdminActionModal = ({ isOpen, onClose, comment, onSubmitAction }) => {
  const [customMessage, setCustomMessage] = useState(
    `Peringatan: Komentar Anda "${comment?.text?.substring(
      0,
      30
    )}..." dianggap melanggar panduan komunitas.`
  );
  const [pointsToDeduct, setPointsToDeduct] = useState(10); // Default pengurangan poin
  const [actionType, setActionType] = useState("reject"); // 'reject' atau 'delete'

  useEffect(() => {
    // Reset saat komentar berubah atau modal dibuka
    if (comment) {
      setCustomMessage(
        `Peringatan: Komentar Anda "${comment.text?.substring(
          0,
          30
        )}..." dianggap melanggar panduan komunitas dan telah di${
          actionType === "reject" ? "tolak" : "hapus"
        }.`
      );
      setPointsToDeduct(actionType === "delete" ? 15 : 10); // Poin beda untuk hapus vs tolak
    }
  }, [comment, actionType]);

  if (!isOpen || !comment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitAction(
      comment,
      actionType,
      customMessage,
      parseInt(pointsToDeduct, 10)
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Tindak Lanjut Komentar Negatif
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-600 mb-1">
          Pengguna:{" "}
          <span className="font-medium">
            {comment.author} ({comment.userId})
          </span>
        </p>
        <p className="text-xs text-gray-600 mb-3">Komentar:</p>
        <blockquote className="text-sm bg-gray-100 p-2 border-l-4 border-gray-300 italic mb-4 max-h-20 overflow-y-auto">
          "{comment.text}"
        </blockquote>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="actionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Aksi untuk Komentar:
            </label>
            <select
              id="actionType"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="reject">Tolak Komentar</option>
              <option value="delete">Hapus Komentar (Pelanggaran Berat)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="adminMessage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pesan Peringatan untuk Pengguna:
            </label>
            <textarea
              id="adminMessage"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="pointsDeduct"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Poin yang Dikurangi:
            </label>
            <input
              type="number"
              id="pointsDeduct"
              min="0"
              max="100" // Batas maksimal pengurangan
              value={pointsToDeduct}
              onChange={(e) =>
                setPointsToDeduct(parseInt(e.target.value, 10) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center space-x-1.5
              ${
                actionType === "reject"
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Send size={16} />
              <span>
                {actionType === "reject"
                  ? "Kirim Peringatan & Tolak"
                  : "Kirim Peringatan & Hapus"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CommentModerationPage = () => {
  const {
    articleCommentsState, // State dari konteks: { articleId: [comments...] }
    moderateComment,
    deleteCommentContext,
  } = useArticleInteractions();

  // Default filter ke 'needs_review' yang menggabungkan pending_review dan bad words
  const [filterStatus, setFilterStatus] = useState("needs_review");
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Modal Aksi Admin
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedCommentForAction, setSelectedCommentForAction] =
    useState(null);

  // Menggabungkan, mem-flatten, dan pra-filter komentar dari semua artikel
  const commentsToReview = useMemo(() => {
    let flatComments = [];
    if (articleCommentsState && allArticlesData) {
      Object.keys(articleCommentsState).forEach((articleId) => {
        const article = allArticlesData[articleId];
        const articleTitle = article?.title || "Artikel Tidak Diketahui";
        const comments = articleCommentsState[articleId] || [];

        const traverseAndFlatten = (
          commentList,
          currentArticleId,
          currentArticleTitle,
          isReply = false,
          parentId = null
        ) => {
          if (!Array.isArray(commentList)) return;
          for (const comment of commentList) {
            if (!comment) continue;
            flatComments.push({
              ...comment,
              articleTitle: currentArticleTitle,
              articleId: currentArticleId,
              isReply,
              parentIdForDisplay: parentId,
            });
            if (comment.replies && comment.replies.length > 0) {
              traverseAndFlatten(
                comment.replies,
                currentArticleId,
                currentArticleTitle,
                true,
                comment.id
              );
            }
          }
        };
        traverseAndFlatten(comments, articleId, articleTitle);
      });
    }
    // Urutkan: pending_review dulu, lalu yang terbaru
    flatComments.sort((a, b) => {
      if (a.status === "pending_review" && b.status !== "pending_review")
        return -1;
      if (a.status !== "pending_review" && b.status === "pending_review")
        return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    return flatComments;
  }, [articleCommentsState]);

  // Fungsi untuk membuka modal admin action
  const openAdminActionModal = (comment, defaultAction = "reject") => {
    setSelectedCommentForAction({ ...comment, defaultAction });
    setIsActionModalOpen(true);
  };

  // Handler untuk submit action dari modal
  const handleAdminSubmitAction = (
    comment,
    actionType,
    customMessage,
    pointsToDeduct
  ) => {
    if (!comment || !comment.articleId || !comment.id || !comment.userId) {
      console.error("Data komentar tidak lengkap untuk aksi admin:", comment);
      return;
    }

    if (actionType === "reject") {
      // Fungsi moderateComment di konteks perlu dimodifikasi untuk menerima pesan & poin
      moderateComment(
        comment.articleId,
        comment.id,
        "rejected",
        comment.userId,
        customMessage,
        pointsToDeduct
      );
    } else if (actionType === "delete") {
      // Fungsi deleteCommentContext di konteks perlu dimodifikasi untuk menerima pesan & poin
      deleteCommentContext(
        comment.articleId,
        comment.id,
        comment.userId,
        true /* isNegative */,
        customMessage,
        pointsToDeduct
      );
    }
  };

  const handleApprove = (comment) => {
    if (!comment || !comment.articleId || !comment.id || !comment.userId) {
      console.error("Data komentar tidak lengkap untuk aksi approve:", comment);
      return;
    }
    // moderateComment untuk approve mungkin tidak perlu customMessage & pointsDeduct
    moderateComment(
      comment.articleId,
      comment.id,
      "approved",
      comment.userId,
      "Komentar Anda telah disetujui."
    );
  };

  // Terapkan filter dan search pada commentsToReview
  const filteredAndSearchedComments = commentsToReview
    .filter((comment) => {
      if (!comment) return false;
      if (filterStatus === "all") return true; // Jika admin ingin melihat semua
      if (filterStatus === "needs_review") {
        // Filter gabungan untuk pending_review dan bad words
        return (
          comment.status === "pending_review" ||
          (comment.status !== "rejected" && containsBadWords(comment.text))
        );
      }
      return comment.status === filterStatus;
    })
    .filter((comment) => {
      if (!comment) return false;
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        comment.text?.toLowerCase().includes(lowerSearchTerm) ||
        comment.author?.toLowerCase().includes(lowerSearchTerm) ||
        (comment.articleTitle &&
          comment.articleTitle.toLowerCase().includes(lowerSearchTerm)) ||
        comment.userId?.toLowerCase().includes(lowerSearchTerm)
      );
    });

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
        <div className="flex items-center mb-2 sm:mb-0">
          <MessageCircleWarning
            size={24}
            className="mr-2 sm:mr-3 text-orange-500"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Moderasi Komentar
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari komentar, user, artikel..."
              className="px-3 py-2 pl-8 border border-gray-300 rounded-md text-xs sm:text-sm w-full focus:ring-sky-500 focus:border-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none w-full px-3 py-2 pl-8 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-sky-500 focus:border-sky-500 bg-white"
            >
              <option value="needs_review">Perlu Review</option>
              <option value="all">Semua Status</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
            <Filter
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Tinjau komentar yang menunggu moderasi atau yang terdeteksi mengandung
        kata-kata tidak pantas.
      </p>

      <div className="space-y-3 sm:space-y-4">
        {filteredAndSearchedComments.length > 0 ? (
          filteredAndSearchedComments.map((comment) => (
            <div
              key={`${comment.articleId}-${comment.id}`}
              className={`p-4 rounded-lg border 
              ${
                comment.status === "pending_review"
                  ? "bg-yellow-50 border-yellow-400 shadow-md"
                  : comment.status === "rejected"
                  ? "bg-red-100 border-red-400 opacity-90"
                  : comment.status === "approved"
                  ? "bg-green-50 border-green-400"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.avatarUrl || "/placeholder-avatar.png"}
                    alt={comment.author}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <span className="font-semibold text-sm text-gray-800">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 ml-1.5">
                      ({comment.userId || "N/A"})
                    </span>
                    {comment.isReply && (
                      <span className="text-xs text-blue-600 ml-2">
                        (Balasan untuk komen ID:{" "}
                        {comment.parentIdForDisplay || "N/A"})
                      </span>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(comment.timestamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize
                    ${
                      comment.status === "pending_review"
                        ? "bg-yellow-200 text-yellow-800"
                        : comment.status === "rejected"
                        ? "bg-red-200 text-red-800"
                        : comment.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
                >
                  {comment.status?.replace("_", " ") || "Tidak Diketahui"}
                </span>
              </div>

              <p className="text-sm text-gray-700 mt-1 mb-3 ml-12 whitespace-pre-wrap p-2 bg-white rounded border border-gray-200">
                {comment.text}
              </p>
              <p className="text-xs text-gray-500 mt-1 ml-12">
                Pada artikel:{" "}
                <Link
                  to={`/article/${comment.articleId}#comment-${comment.id}`}
                  className="text-sky-600 hover:underline"
                  title={comment.articleTitle}
                >
                  {comment.articleTitle
                    ? comment.articleTitle.length > 40
                      ? comment.articleTitle.substring(0, 40) + "..."
                      : comment.articleTitle
                    : "N/A"}
                </Link>
              </p>
              <div className="flex space-x-2 mt-3 ml-12">
                {comment.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(comment)}
                    className="px-3 py-1.5 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1.5 disabled:opacity-60"
                    disabled={comment.status === "approved"}
                    title="Setujui komentar ini"
                  >
                    <CheckCircle size={14} />
                    <span>Setujui</span>
                  </button>
                )}
                {comment.status !== "rejected" && (
                  <button
                    onClick={() => openAdminActionModal(comment, "reject")}
                    className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center space-x-1.5 disabled:opacity-60"
                    disabled={comment.status === "rejected"}
                    title="Tolak komentar ini (beri peringatan & kurangi poin)"
                  >
                    <XCircle size={14} />
                    <span>Tolak</span>
                  </button>
                )}
                <button
                  onClick={() => openAdminActionModal(comment, "delete")}
                  className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1.5"
                  title="Hapus komentar ini secara permanen (beri peringatan & kurangi poin)"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            Tidak ada komentar yang sesuai dengan filter atau menunggu moderasi
            saat ini.
          </p>
        )}
      </div>

      {/* Render Modal */}
      <AdminActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        comment={selectedCommentForAction}
        onSubmitAction={handleAdminSubmitAction}
      />
    </div>
  );
};

export default CommentModerationPage;
