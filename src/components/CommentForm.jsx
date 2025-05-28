import React, { useState } from "react";
import { Send } from "lucide-react";

const CommentForm = ({
  onSubmitComment,
  currentUserAvatar = "/placeholder-avatar.png",
}) => {
  const [commentText, setCommentText] = useState("");
  // Nama author bisa diambil dari state global/konteks jika user login
  const [commentAuthor, setCommentAuthor] = useState(""); // Atau biarkan kosong untuk anonim

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    // Jika commentAuthor kosong, set default "Pengguna Anonim"
    const authorToSubmit =
      commentAuthor.trim() === "" ? "Pengguna Anonim" : commentAuthor.trim();
    onSubmitComment(authorToSubmit, commentText);
    setCommentText("");
    setCommentAuthor(""); // Reset nama setelah submit, atau biarkan jika ingin tetap
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
            className="w-full mb-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tulis komentar Anda..."
            rows="3"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="mt-3 flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Send size={16} />
            <span>Kirim</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
