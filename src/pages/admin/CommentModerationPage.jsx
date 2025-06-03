// src/pages/admin/CommentModerationPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { initialCommentsData, allArticlesData } from "../../data/mockData"; // Pastikan path ini benar
import { useArticleInteractions } from "../../hooks/useArticleInteractions"; // Pastikan path ini benar
import {
  MessageCircleWarning,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
} from "lucide-react";

// Fungsi ini bisa juga diimpor dari utils jika digunakan di banyak tempat
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

const CommentModerationPage = () => {
  const {
    articleCommentsState, // Ini adalah state dari konteks: { articleId: [comments...] }
    moderateComment,
    deleteCommentContext,
  } = useArticleInteractions();

  // Default filter ke 'pending_review' atau komentar yang mengandung kata buruk
  const [filterStatus, setFilterStatus] = useState("pending_review");
  const [searchTerm, setSearchTerm] = useState("");

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
            // Logika untuk menentukan apakah komentar ini perlu review
            // Selain status 'pending_review', kita juga bisa cek bad words di sini
            // jika komentar 'approved' masih bisa di-flag oleh sistem/user lain nantinya.
            // Untuk sekarang, kita fokus pada filter berdasarkan status yang sudah ada di data.
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
  }, [articleCommentsState]); // Bergantung pada articleCommentsState

  const handleApprove = (comment) => {
    if (!comment || !comment.articleId || !comment.id || !comment.userId) {
      console.error("Data komentar tidak lengkap untuk aksi approve:", comment);
      return;
    }
    moderateComment(comment.articleId, comment.id, "approved", comment.userId);
  };

  const handleReject = (comment) => {
    if (!comment || !comment.articleId || !comment.id || !comment.userId) {
      console.error("Data komentar tidak lengkap untuk aksi reject:", comment);
      return;
    }
    // Fungsi moderateComment di konteks akan menangani pengurangan poin dan notifikasi
    moderateComment(comment.articleId, comment.id, "rejected", comment.userId);
  };

  const handleDelete = (comment) => {
    if (!comment || !comment.articleId || !comment.id || !comment.userId) {
      console.error("Data komentar tidak lengkap untuk aksi delete:", comment);
      return;
    }
    // Tentukan apakah penghapusan ini karena konten negatif
    // Bisa berdasarkan status 'rejected' atau cek bad words lagi
    const isCommentNegative =
      comment.status === "rejected" || containsBadWords(comment.text);
    deleteCommentContext(
      comment.articleId,
      comment.id,
      comment.userId,
      isCommentNegative // Jika true, konteks akan mengurangi poin
    );
  };

  // Terapkan filter dan search pada commentsToReview
  const displayComments = commentsToReview
    .filter((comment) => {
      if (!comment) return false;
      if (filterStatus === "all") return true; // Jika admin ingin melihat semua
      if (filterStatus === "needs_action") {
        // Filter baru untuk yang perlu tindakan
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center mb-3 sm:mb-0">
          <MessageCircleWarning size={28} className="mr-3 text-orange-500" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Moderasi Komentar
          </h1>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              placeholder="Cari komentar, user, artikel..."
              className="px-3 py-2 pl-8 border border-gray-300 rounded-md text-sm w-full focus:ring-sky-500 focus:border-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative flex-grow sm:flex-grow-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none w-full px-3 py-2 pl-8 border border-gray-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500 bg-white"
            >
              <option value="pending_review">Perlu Review</option>{" "}
              {/* Default ke ini */}
              <option value="needs_action">
                Perlu Tindakan (Review & Bad Words)
              </option>
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

      <p className="text-sm text-gray-600 mb-6">
        Tinjau komentar yang menunggu moderasi atau yang terdeteksi mengandung
        kata-kata tidak pantas. Komentar yang bersih akan otomatis disetujui
        saat dibuat.
      </p>

      <div className="space-y-4">
        {displayComments.length > 0 ? (
          displayComments.map((comment) => (
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
                    onClick={() => handleReject(comment)}
                    className="px-3 py-1.5 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center space-x-1.5 disabled:opacity-60"
                    disabled={comment.status === "rejected"}
                    title="Tolak komentar ini (beri peringatan & kurangi poin)"
                  >
                    <XCircle size={14} />
                    <span>Tolak</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment)}
                  className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1.5"
                  title="Hapus komentar ini secara permanen"
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
    </div>
  );
};
export default CommentModerationPage;
