// src/components/CommentItem.jsx
import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Send } from "lucide-react";

// Komponen ReplyForm tetap sama seperti sebelumnya
const ReplyForm = ({ parentId, onSubmitReply, onCancel }) => {
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === "") return;
    onSubmitReply(parentId, replyAuthor, replyText);
    setReplyText("");
    setReplyAuthor("");
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 ml-8 pl-4 border-l-2 border-gray-200"
    >
      <input
        type="text"
        value={replyAuthor}
        onChange={(e) => setReplyAuthor(e.target.value)}
        placeholder="Nama Anda (opsional)"
        className="w-full mb-2 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Tulis balasan Anda..."
        rows="2"
        required
        className="w-full mb-2 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 focus:outline-none transition-colors"
        >
          <Send size={14} />
          <span>Balas</span>
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded-md"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

const CommentItem = ({ comment, onAddReply, indentLevel = 0 }) => {
  const {
    id,
    author,
    text,
    timestamp,
    avatarUrl,
    likes: initialLikes = 0,
    replies = [],
  } = comment;

  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(initialLikes);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLikeComment = () => {
    if (isLiked) {
      setCurrentLikes(currentLikes - 1);
    } else {
      setCurrentLikes(currentLikes + 1);
    }
    setIsLiked(!isLiked);
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const indentStyle = { marginLeft: `${indentLevel * 1.5}rem` }; // Mengurangi sedikit indentasi

  return (
    <div
      style={indentLevel > 0 ? indentStyle : {}}
      className={`py-3 ${
        indentLevel === 0
          ? "border-b border-gray-100 last:border-b-0"
          : "mt-1 pt-1 border-t border-gray-100"
      }`}
    >
      {" "}
      {/* Penyesuaian border dan margin untuk balasan */}
      <div className="flex items-start space-x-3">
        <img
          src={avatarUrl || "/placeholder-avatar.png"}
          alt={`Avatar ${author}`}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <div
            className={`p-3 rounded-lg ${
              indentLevel > 0 ? "bg-gray-50" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 hover:underline cursor-pointer">
                {author}
              </p>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
          </div>
          <div className="flex items-center space-x-3 mt-1 pl-1">
            <button
              onClick={handleLikeComment}
              className={`text-xs font-medium flex items-center space-x-1 transition-colors
                          ${
                            isLiked
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600"
                          }`}
            >
              <ThumbsUp size={14} className={isLiked ? "fill-blue-500" : ""} />
              <span>{currentLikes > 0 ? currentLikes : "Suka"}</span>
            </button>
            <span className="text-xs text-gray-400">•</span>
            <button
              onClick={toggleReplyForm}
              className="text-xs text-gray-500 hover:text-blue-600 font-medium flex items-center space-x-1"
            >
              <MessageSquare size={14} />
              {/* Menampilkan jumlah balasan */}
              <span>
                Balas{" "}
                {replies && replies.length > 0 ? `(${replies.length})` : ""}
              </span>
            </button>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">
              {new Date(timestamp).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {showReplyForm && (
            <ReplyForm
              parentId={id}
              onSubmitReply={onAddReply} // onAddReply diteruskan dari props CommentItem
              onCancel={() => setShowReplyForm(false)}
            />
          )}

          {replies && replies.length > 0 && (
            <div
              className={`mt-2 space-y-1 ${indentLevel < 2 ? "pl-0" : "ml-0"}`}
            >
              {" "}
              {/* Hapus border dan margin kiri tambahan di sini, biarkan indentStyle utama yg bekerja */}
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onAddReply={onAddReply}
                  indentLevel={indentLevel + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
