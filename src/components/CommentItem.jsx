// src/components/CommentItem.jsx
import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react";

// Komponen ReplyForm (tetap sama, pastikan onSubmitReply menerima parentId, author, text)
const ReplyForm = ({ parentId, onSubmitReply, onCancel }) => {
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() === "") return;
    // onSubmitReply sekarang dipanggil dari DetailPage melalui CommentSection dan CommentItem
    // yang akan memanggil fungsi konteks dengan articleId, parentId, author, text
    onSubmitReply(parentId, replyAuthor, replyText);
    setReplyText("");
    setReplyAuthor("");
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 ml-8 pl-4 border-l-2 border-gray-200"
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
          <Send size={14} /> <span>Balas</span>
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

const CommentItem = ({
  comment,
  onAddReply,
  onToggleLikeComment,
  onToggleDislikeComment,
  indentLevel = 0,
}) => {
  const {
    id,
    author,
    text,
    timestamp,
    avatarUrl,
    likes = 0,
    dislikes = 0,
    userVoteOnComment = null,
    replies = [],
  } = comment; // Data diambil dari prop 'comment' yang berasal dari konteks

  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = () => {
    onToggleLikeComment(id); // Panggil handler dari props dengan comment.id
  };

  const handleDislike = () => {
    onToggleDislikeComment(id); // Panggil handler dari props dengan comment.id
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const indentStyle =
    indentLevel > 0 ? { marginLeft: `${indentLevel * 1.5}rem` } : {};

  return (
    <div style={indentStyle} className="py-3">
      <div className="flex items-start space-x-3">
        <img
          src={avatarUrl || "/placeholder-avatar.png"}
          alt={`Avatar ${author}`}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-grow">
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
            <p className="text-xs sm:text-sm font-semibold text-gray-800 hover:underline cursor-pointer">
              {author}
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-1.5 pl-1">
            <button
              onClick={handleLike} // Menggunakan handler baru
              className={`text-xs font-medium flex items-center space-x-1 transition-colors
                          ${
                            userVoteOnComment === "liked"
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600"
                          }`}
            >
              <ThumbsUp
                size={14}
                className={
                  userVoteOnComment === "liked"
                    ? "fill-blue-500 text-blue-600"
                    : ""
                }
              />
              <span>{likes > 0 ? likes : "Suka"}</span>
            </button>
            <button
              onClick={handleDislike} // Menggunakan handler baru
              className={`text-xs font-medium flex items-center space-x-1 transition-colors
                          ${
                            userVoteOnComment === "disliked"
                              ? "text-red-600"
                              : "text-gray-500 hover:text-red-600"
                          }`}
            >
              <ThumbsDown
                size={14}
                className={
                  userVoteOnComment === "disliked"
                    ? "fill-red-500 text-red-600"
                    : ""
                }
              />
              <span>{dislikes > 0 ? dislikes : ""}</span>
            </button>
            <span className="text-xs text-gray-400">•</span>
            <button
              onClick={toggleReplyForm}
              className="text-xs text-gray-500 hover:text-blue-600 font-medium flex items-center space-x-1"
            >
              <MessageSquare size={14} />
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
              onSubmitReply={onAddReply} // onAddReply diteruskan ke ReplyForm
              onCancel={() => setShowReplyForm(false)}
            />
          )}
          {replies && replies.length > 0 && (
            <div className="mt-3 space-y-0 divide-y divide-gray-200">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onAddReply={onAddReply}
                  onToggleLikeComment={onToggleLikeComment}
                  onToggleDislikeComment={onToggleDislikeComment}
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
