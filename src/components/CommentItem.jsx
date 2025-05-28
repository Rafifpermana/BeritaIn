// src/components/CommentItem.jsx
import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react"; // Tambahkan ThumbsDown

// Komponen ReplyForm tetap sama
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

const CommentItem = ({ comment, onAddReply, indentLevel = 0 }) => {
  // Tambahkan dislikes ke destructuring dengan nilai default 0
  const {
    id,
    author,
    text,
    timestamp,
    avatarUrl,
    likes: initialLikes = 0,
    dislikes: initialDislikes = 0,
    replies = [],
  } = comment;

  const [currentLikes, setCurrentLikes] = useState(initialLikes);
  const [currentDislikes, setCurrentDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState(null); // null, 'liked', 'disliked'
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLikeComment = () => {
    if (userVote === "liked") {
      // Unlike
      setCurrentLikes(currentLikes - 1);
      setUserVote(null);
    } else {
      // Like baru atau pindah dari dislike
      setCurrentLikes(currentLikes + 1);
      if (userVote === "disliked") {
        setCurrentDislikes(currentDislikes - 1);
      }
      setUserVote("liked");
    }
    // TODO: Kirim update like ke backend
  };

  const handleDislikeComment = () => {
    if (userVote === "disliked") {
      // Un-dislike
      setCurrentDislikes(currentDislikes - 1);
      setUserVote(null);
    } else {
      // Dislike baru atau pindah dari like
      setCurrentDislikes(currentDislikes + 1);
      if (userVote === "liked") {
        setCurrentLikes(currentLikes - 1);
      }
      setUserVote("disliked");
    }
    // TODO: Kirim update dislike ke backend
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
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs sm:text-sm font-semibold text-gray-800 hover:underline cursor-pointer">
                {author}
              </p>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-1.5 pl-1">
            {" "}
            {/* Penyesuaian space-x */}
            <button
              onClick={handleLikeComment}
              className={`text-xs font-medium flex items-center space-x-1 transition-colors
                          ${
                            userVote === "liked"
                              ? "text-blue-600"
                              : "text-gray-500 hover:text-blue-600"
                          }`}
            >
              <ThumbsUp
                size={14}
                className={
                  userVote === "liked" ? "fill-blue-500 text-blue-600" : ""
                }
              />{" "}
              {/* Fill icon saat liked */}
              <span>{currentLikes > 0 ? currentLikes : "Suka"}</span>
            </button>
            {/* Tombol Dislike Baru */}
            <button
              onClick={handleDislikeComment}
              className={`text-xs font-medium flex items-center space-x-1 transition-colors
                          ${
                            userVote === "disliked"
                              ? "text-red-600"
                              : "text-gray-500 hover:text-red-600"
                          }`}
            >
              <ThumbsDown
                size={14}
                className={
                  userVote === "disliked" ? "fill-red-500 text-red-600" : ""
                }
              />{" "}
              {/* Fill icon saat disliked */}
              <span>{currentDislikes > 0 ? currentDislikes : ""}</span>{" "}
              {/* Hanya tampilkan angka jika > 0, atau "Tidak Suka" */}
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
              onSubmitReply={onAddReply}
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
