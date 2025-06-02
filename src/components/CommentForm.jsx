// src/components/CommentForm.jsx
import React, { useState } from "react";
import { Send, Info } from "lucide-react"; // Tambahkan Info untuk ikon pesan

const CommentForm = ({
  onSubmitComment,
  currentUserAvatar = "/placeholder-avatar.png",
  currentUserPoints,
}) => {
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  const MIN_POINTS_TO_COMMENT = 50; // Definisikan batas minimal poin
  const canComment = currentUserPoints >= MIN_POINTS_TO_COMMENT;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canComment) {
      // Meskipun sudah disabled, ini sebagai pengaman tambahan
      alert(
        `Anda memerlukan minimal ${MIN_POINTS_TO_COMMENT} poin untuk berkomentar.`
      );
      return;
    }
    if (commentText.trim() === "") return;
    const authorToSubmit =
      commentAuthor.trim() === "" ? "Pengguna Anonim" : commentAuthor.trim();
    onSubmitComment(authorToSubmit, commentText);
    setCommentText("");
    // setCommentAuthor(''); // Biarkan nama terisi jika pengguna ingin berkomentar lagi
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 mb-8 p-4 bg-gray-50 rounded-lg shadow"
    >
      <div className="flex items-start space-x-3">
        <img
          src={currentUserAvatar}
          alt="Avatar Anda"
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <input
            type="text"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="Nama Anda (opsional)"
            disabled={!canComment} // Nonaktifkan jika tidak bisa komentar
            className={`w-full mb-2 px-3 py-2 text-sm border rounded-md focus:ring-1 focus:border-blue-500 outline-none transition-colors
                        ${
                          !canComment
                            ? "bg-gray-200 cursor-not-allowed"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              canComment
                ? "Tulis komentar Anda..."
                : "Poin Anda tidak cukup untuk berkomentar."
            }
            rows="3"
            required
            disabled={!canComment} // Nonaktifkan jika tidak bisa komentar
            className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:border-blue-500 outline-none resize-none transition-colors
                        ${
                          !canComment
                            ? "bg-gray-200 cursor-not-allowed placeholder-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
          />
          {!canComment && (
            <div className="mt-2 flex items-center text-xs text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
              <Info size={16} className="mr-2 flex-shrink-0" />
              <span>
                Anda memerlukan minimal {MIN_POINTS_TO_COMMENT} poin untuk dapat
                berkomentar.
              </span>
            </div>
          )}
          <button
            type="submit"
            disabled={!canComment} // Nonaktifkan jika tidak bisa komentar
            className={`mt-3 flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 
                        ${
                          canComment
                            ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
          >
            <Send size={16} />
            <span>{canComment ? "Kirim" : "Tidak Bisa Komentar"}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
