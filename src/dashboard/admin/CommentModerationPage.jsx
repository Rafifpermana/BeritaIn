import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  MessageCircleWarning,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Filter,
  Send,
} from "lucide-react";

const ActionModal = ({ isOpen, onClose, onSubmit, comment }) => {
  const [action, setAction] = useState("reject");
  const [points, setPoints] = useState(10);

  useEffect(() => {
    if (comment) {
      const defaultPoints = action === "delete" ? 25 : 15;
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
          "{comment.content}"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-6 mt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-md"
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
  const { apiCall } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending_review");
  const [modalState, setModalState] = useState({
    isOpen: false,
    comment: null,
  });

  const fetchComments = useCallback(
    async (status) => {
      setLoading(true);
      try {
        const endpoint = `/admin/comments?status=${status}`;
        const data = await apiCall(endpoint);
        setComments(data.data || []);
      } catch (error) {
        console.error("Gagal mengambil komentar:", error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  useEffect(() => {
    fetchComments(filterStatus);
  }, [fetchComments, filterStatus]);

  const handleApprove = async (comment) => {
    try {
      await apiCall(`/admin/comments/${comment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved" }),
      });
      fetchComments(filterStatus);
    } catch (error) {
      alert(`Gagal menyetujui komentar: ${error.message}`);
    }
  };

  const handleConfirmAction = async (comment, action, points) => {
    if (action === "reject") {
      try {
        await apiCall(`/admin/comments/${comment.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "rejected",
            points_to_deduct: points,
          }),
        });
      } catch (error) {
        alert(`Gagal menolak komentar: ${error.message}`);
      }
    } else if (action === "delete") {
      try {
        await apiCall(`/admin/comments/${comment.id}`, { method: "DELETE" });
      } catch (error) {
        alert(`Gagal menghapus komentar: ${error.message}`);
      }
    }
    fetchComments(filterStatus);
  };

  const openModal = (comment) => setModalState({ isOpen: true, comment });
  const closeModal = () => setModalState({ isOpen: false, comment: null });

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

      {loading ? (
        <div className="text-center py-10">Memuat komentar...</div>
      ) : (
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
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
                      src={
                        comment.user?.avatar_url || "/placeholder-avatar.png"
                      }
                      alt={comment.user?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="font-semibold text-gray-900">
                      {comment.user?.name || "Pengguna Dihapus"}
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
                  "{comment.content}"
                </blockquote>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">
                    Pada Artikel:{" "}
                    <span className="text-sky-600">
                      {comment.article?.title || "Artikel Dihapus"}
                    </span>
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
      )}

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
