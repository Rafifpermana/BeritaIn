// src/dashboard/admin/CommentModerationPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useArticleInteractions } from "../../hooks/useArticleInteractions";
import { allArticlesData } from "../../data/mockData";
import {
  MessageCircleWarning,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  Send,
} from "lucide-react";

// Modal Aksi dengan input poin
const ActionModal = ({ isOpen, onClose, onSubmit, comment }) => {
  const [action, setAction] = useState("reject");
  const [points, setPoints] = useState(10);

  useEffect(() => {
    // Set poin default berdasarkan aksi yang dipilih
    if (comment) {
      const defaultPoints = action === "delete" ? 15 : 10;
      setPoints(defaultPoints);
    }
  }, [action, comment]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment, action, points);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tindak Lanjut Komentar
        </h2>
        <blockquote className="text-sm bg-gray-100 p-3 border-l-4 border-gray-300 italic mb-4 max-h-24 overflow-y-auto">
          "{comment.text}"
        </blockquote>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="actionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pilih Aksi
            </label>
            <select
              id="actionType"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="reject">Tolak Komentar</option>
              <option value="delete">Hapus Komentar (Pelanggaran Berat)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="pointsDeduct"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Poin yang Dikurangi
            </label>
            <input
              type="number"
              id="pointsDeduct"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value, 10) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Batal
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center space-x-1.5 ${
              action === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            <Send size={16} />
            <span>Konfirmasi Aksi</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const CommentModerationPage = () => {
  const { articleCommentsState, moderateComment, deleteCommentContext } =
    useArticleInteractions();
  const [filterStatus, setFilterStatus] = useState("pending_review");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    comment: null,
  });

  // Mengumpulkan semua komentar dari semua artikel menjadi satu array
  const allComments = useMemo(() => {
    let flatComments = [];
    Object.keys(articleCommentsState).forEach((articleId) => {
      const comments = articleCommentsState[articleId] || [];
      const article = allArticlesData[articleId];

      const traverseAndFlatten = (commentList) => {
        if (!Array.isArray(commentList)) return;
        commentList.forEach((comment) => {
          flatComments.push({
            ...comment,
            articleTitle: article?.title || "Artikel Tidak Diketahui",
            articleId: articleId,
          });
          if (comment.replies?.length > 0) traverseAndFlatten(comment.replies);
        });
      };
      traverseAndFlatten(comments);
    });
    return flatComments.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [articleCommentsState]);

  // Terapkan filter dan search
  const filteredComments = useMemo(() => {
    return allComments
      .filter(
        (comment) => filterStatus === "all" || comment.status === filterStatus
      )
      .filter((comment) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          comment.text?.toLowerCase().includes(lowerSearchTerm) ||
          comment.author?.toLowerCase().includes(lowerSearchTerm) ||
          comment.articleTitle?.toLowerCase().includes(lowerSearchTerm)
        );
      });
  }, [allComments, filterStatus, searchTerm]);

  const openModal = (comment) => setModalState({ isOpen: true, comment });
  const closeModal = () => setModalState({ isOpen: false, comment: null });

  const handleConfirmAction = (comment, action, points) => {
    if (action === "reject") {
      moderateComment(
        comment.articleId,
        comment.id,
        "rejected",
        comment.userId,
        points
      );
    } else if (action === "delete") {
      deleteCommentContext(
        comment.articleId,
        comment.id,
        comment.userId,
        points
      );
    }
  };

  const handleApprove = (comment) => {
    moderateComment(comment.articleId, comment.id, "approved", comment.userId);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center mb-3 sm:mb-0">
          <MessageCircleWarning size={24} className="mr-3 text-orange-500" />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Moderasi Komentar
          </h1>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari komentar..."
              className="w-full px-3 py-2 pl-9 border rounded-md text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none w-full sm:w-auto bg-white px-3 py-2 pl-9 border rounded-md text-sm"
            >
              <option value="pending_review">Perlu Review</option>
              <option value="all">Semua Status</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg border shadow-sm ${
                comment.status === "pending_review"
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={comment.avatarUrl}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="font-semibold text-gray-900">
                    {comment.author}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                    comment.status === "pending_review"
                      ? "bg-yellow-200 text-yellow-800"
                      : comment.status === "rejected"
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {comment.status.replace("_", " ")}
                </span>
              </div>
              <blockquote className="my-3 pl-3 text-gray-700 bg-white border-l-4 p-3 italic">
                "{comment.text}"
              </blockquote>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-500">
                  Pada:{" "}
                  <Link
                    to={`/article/${comment.articleId}`}
                    className="text-sky-600 hover:underline"
                  >
                    {comment.articleTitle}
                  </Link>
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(comment)}
                    disabled={comment.status === "approved"}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    <CheckCircle size={14} />
                    <span>Setujui</span>
                  </button>
                  <button
                    onClick={() => openModal(comment)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    <XCircle size={14} />
                    <span>Tindak Lanjut</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            Tidak ada komentar yang cocok dengan filter.
          </p>
        )}
      </div>

      <ActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleConfirmAction}
        comment={modalState.comment}
      />
    </div>
  );
};

export default CommentModerationPage;
