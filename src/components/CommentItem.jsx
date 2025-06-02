// src/components/CommentItem.jsx
import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Info } from "lucide-react"; // Tambahkan Info untuk ikon pesan error

// Komponen ReplyForm sekarang di dalam CommentItem dan memiliki logika poin
const ReplyForm = ({
  parentId,
  onSubmitReply,
  onCancel,
  currentUserPoints,
}) => {
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");

  const MIN_POINTS_TO_REPLY = 50; // Batas poin untuk membalas (bisa sama atau beda dengan komentar utama)
  const canReply = currentUserPoints >= MIN_POINTS_TO_REPLY;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canReply) {
      // Pengaman tambahan
      alert(
        `Anda memerlukan minimal ${MIN_POINTS_TO_REPLY} poin untuk membalas.`
      );
      return;
    }
    if (replyText.trim() === "") return;

    const authorToSubmit =
      replyAuthor.trim() === "" ? "Pengguna Anonim" : replyAuthor;
    onSubmitReply(parentId, authorToSubmit, replyText); // parentId, author, text
    setReplyText("");
    setReplyAuthor(""); // Reset author juga jika diinginkan
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 ml-8 pl-4 border-l-2 border-gray-200" // Styling dasar untuk form balasan
    >
      <input
        type="text"
        value={replyAuthor}
        onChange={(e) => setReplyAuthor(e.target.value)}
        placeholder="Nama Anda (opsional)"
        disabled={!canReply}
        className={`w-full mb-2 px-3 py-1.5 text-xs border rounded-md focus:ring-1 focus:border-blue-500 outline-none transition-colors
                    ${
                      !canReply
                        ? "bg-gray-200 cursor-not-allowed text-gray-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
      />
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={
          canReply
            ? "Tulis balasan Anda..."
            : "Poin Anda tidak cukup untuk membalas."
        }
        rows="2"
        required
        disabled={!canReply}
        className={`w-full mb-2 px-3 py-1.5 text-xs border rounded-md focus:ring-1 focus:border-blue-500 outline-none resize-none transition-colors
                    ${
                      !canReply
                        ? "bg-gray-200 cursor-not-allowed placeholder-red-500 text-gray-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
      />
      {!canReply && (
        <div className="mb-2 flex items-center text-xs text-red-600">
          {" "}
          {/* Pesan error jika poin tidak cukup */}
          <Info size={14} className="mr-1 flex-shrink-0" />
          <span>Minimal {MIN_POINTS_TO_REPLY} poin untuk membalas.</span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          disabled={!canReply}
          className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none
                      ${
                        canReply
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
        >
          <Send size={14} /> <span>{canReply ? "Balas" : "Tidak Bisa"}</span>
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={!canReply && false} // Tombol batal selalu aktif atau bisa dinonaktifkan juga
            className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
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
  currentUserPointsForReply, // Terima prop poin pengguna untuk membalas
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
  } = comment;

  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = () => {
    onToggleLikeComment(id);
  };

  const handleDislike = () => {
    onToggleDislikeComment(id);
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
              onClick={handleLike}
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
              onClick={handleDislike}
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
              onSubmitReply={onAddReply}
              onCancel={() => setShowReplyForm(false)}
              currentUserPoints={currentUserPointsForReply} // Teruskan poin ke ReplyForm
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
                  currentUserPointsForReply={currentUserPointsForReply} // Teruskan poin ke balasan berantai
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
