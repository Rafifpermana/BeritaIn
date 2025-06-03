// src/pages/admin/CommentModerationPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Impor data yang dibutuhkan dari mockData.js
import { initialCommentsData, allArticlesData } from "../../data/mockData";
import { useArticleInteractions } from "../../hooks/useArticleInteractions"; // Impor hook jika digunakan untuk aksi
import {
  MessageCircleWarning,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
} from "lucide-react";

const CommentModerationPage = () => {
  // Ambil fungsi moderasi dari konteks jika aksi akan dilakukan melalui konteks
  const { moderateComment, deleteCommentContext } = useArticleInteractions();

  const [allCommentsFlat, setAllCommentsFlat] = useState([]);
  const [filterStatus, setFilterStatus] = useState("pending_review");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let flatComments = [];
    // Pastikan initialCommentsData dan allArticlesData sudah terdefinisi (diimpor)
    if (initialCommentsData && allArticlesData) {
      Object.keys(initialCommentsData).forEach((articleId) => {
        const article = allArticlesData[articleId]; // Akses allArticlesData
        const articleTitle = article?.title || "Artikel Tidak Diketahui";
        const comments = initialCommentsData[articleId] || [];

        const traverseAndFlatten = (
          commentList,
          currentArticleId,
          currentArticleTitle,
          isReply = false,
          parentId = null
        ) => {
          if (!commentList) return;
          for (const comment of commentList) {
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
    flatComments.sort((a, b) => {
      if (a.status === "pending_review" && b.status !== "pending_review")
        return -1;
      if (a.status !== "pending_review" && b.status === "pending_review")
        return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    setAllCommentsFlat(flatComments);
  }, [initialCommentsData, allArticlesData]); // Tambahkan allArticlesData sebagai dependensi jika ia bisa berubah (meskipun di sini ia statis)

  const handleApprove = (comment) => {
    moderateComment(comment.articleId, comment.id, "approved", comment.userId);
  };

  const handleReject = (comment) => {
    moderateComment(comment.articleId, comment.id, "rejected", comment.userId);
  };

  const handleDelete = (comment) => {
    const isCommentNegative =
      comment.status === "rejected" || containsBadWords(comment.text);
    deleteCommentContext(
      comment.articleId,
      comment.id,
      comment.userId,
      isCommentNegative
    );
  };

  const containsBadWords = (text) => {
    // Pindahkan atau impor fungsi ini jika digunakan di banyak tempat
    const badWords = [
      "jelek",
      "buruk",
      "bodoh",
      "spam",
      "kasar",
      "anjing",
      "bangsat",
    ];
    const lowerText = text.toLowerCase();
    return badWords.some((word) => lowerText.includes(word));
  };

  const filteredAndSearchedComments = allCommentsFlat
    .filter((comment) => {
      if (filterStatus === "all") return true;
      return comment.status === filterStatus;
    })
    .filter(
      (comment) =>
        comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comment.articleTitle &&
          comment.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
              placeholder="Cari..."
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
              <option value="all">Semua Status</option>
              <option value="pending_review">Menunggu Review</option>
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

      <p className="text-sm text-gray-600 mb-4">
        Daftar komentar yang membutuhkan tindakan atau telah dimoderasi.
      </p>

      <div className="space-y-4">
        {filteredAndSearchedComments.length > 0 ? (
          filteredAndSearchedComments.map((comment) => (
            <div
              key={`${comment.articleId}-${comment.id}`}
              className={`p-3 rounded-md border 
            ${
              comment.status === "pending_review"
                ? "bg-yellow-50 border-yellow-400 shadow-md"
                : comment.status === "rejected"
                ? "bg-red-50 border-red-400 opacity-80"
                : comment.status === "approved"
                ? "bg-green-50 border-green-300"
                : "bg-gray-50 border-gray-200"
            }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <img
                    src={comment.avatarUrl || "/placeholder-avatar.png"}
                    alt={comment.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold text-sm text-gray-800">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
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
                  className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize
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
                  {comment.status?.replace("_", " ") || "N/A"}
                </span>
              </div>

              <p className="text-sm text-gray-700 mt-2 ml-10 whitespace-pre-wrap">
                {comment.text}
              </p>
              <p className="text-xs text-gray-500 mt-1 ml-10">
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
              <div className="flex space-x-2 mt-3 ml-10">
                {comment.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(comment)}
                    className="px-2.5 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1 disabled:opacity-50"
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
                    className="px-2.5 py-1 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center space-x-1 disabled:opacity-50"
                    disabled={comment.status === "rejected"}
                    title="Tolak komentar ini (beri peringatan & kurangi poin)"
                  >
                    <XCircle size={14} />
                    <span>Tolak</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment)}
                  className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1"
                  title="Hapus komentar ini secara permanen"
                >
                  <Trash2 size={14} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            Tidak ada komentar yang sesuai dengan filter saat ini.
          </p>
        )}
      </div>
    </div>
  );
};
export default CommentModerationPage;
