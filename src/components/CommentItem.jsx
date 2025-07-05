// src/components/CommentItem.jsx
import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// Komponen ReplyForm dengan pengecekan poin
const ReplyForm = ({ parentId, onSubmitReply, onCancel }) => {
  const { currentUser } = useAuth();
  const [replyText, setReplyText] = useState("");

  const MIN_POINTS_TO_REPLY = 50; // Ketentuan minimal poin
  const isGuest = !currentUser;
  const canReply = !isGuest && currentUser.points >= MIN_POINTS_TO_REPLY;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isGuest) {
      alert("Anda harus login untuk membalas.");
      return;
    }
    if (!canReply) {
      alert(
        `Poin Anda tidak cukup. Diperlukan minimal ${MIN_POINTS_TO_REPLY} poin untuk membalas.`
      );
      return;
    }
    if (replyText.trim() === "") return;

    onSubmitReply(parentId, currentUser.name, replyText);
    setReplyText("");
    if (onCancel) onCancel();
  };

  const placeholderText = isGuest
    ? "Login untuk membalas."
    : canReply
    ? "Tulis balasan Anda..."
    : "Poin Anda tidak cukup untuk membalas.";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 ml-8 pl-4 border-l-2 border-gray-200"
    >
      {currentUser && (
        <p className="text-xs font-semibold text-gray-800 mb-2">
          Membalas sebagai: {currentUser.name}
        </p>
      )}
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={placeholderText}
        rows="2"
        required
        disabled={isGuest || !canReply}
        className={`w-full mb-2 px-3 py-1.5 text-xs border rounded-md resize-none transition-colors ${
          isGuest || !canReply
            ? "bg-gray-200 cursor-not-allowed placeholder-red-500"
            : "border-gray-300"
        }`}
      />
      {!isGuest && !canReply && (
        <div className="mb-2 flex items-center text-xs text-red-600">
          <Info size={14} className="mr-1" />
          Minimal {MIN_POINTS_TO_REPLY} poin. Poin Anda: {currentUser.points}.
        </div>
      )}
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          disabled={isGuest || !canReply}
          className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            canReply && !isGuest
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
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

const CommentItem = ({
  comment,
  onAddReply,
  onToggleLikeComment,
  onToggleDislikeComment,
  indentLevel = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const {
    id,
    author,
    content,
    created_at,
    avatarUrl,
    likes = 0,
    dislikes = 0,
    userVoteOnComment = null,
    replies = [],
  } = comment;
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
            <p className="text-sm font-semibold text-gray-800">{author}</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {content}
            </p>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 mt-1.5 pl-1">
            <button
              onClick={() => onToggleLikeComment(id)}
              className={`text-xs font-medium flex items-center space-x-1 transition-colors ${
                userVoteOnComment === "liked"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <ThumbsUp
                size={14}
                className={
                  userVoteOnComment === "liked"
                    ? "fill-current text-blue-600"
                    : ""
                }
              />
              <span>{likes > 0 ? likes : "Suka"}</span>
            </button>
            <button
              onClick={() => onToggleDislikeComment(id)}
              className={`text-xs font-medium flex items-center space-x-1 transition-colors ${
                userVoteOnComment === "disliked"
                  ? "text-red-600"
                  : "text-gray-500 hover:text-red-600"
              }`}
            >
              <ThumbsDown
                size={14}
                className={
                  userVoteOnComment === "disliked"
                    ? "fill-current text-red-600"
                    : ""
                }
              />
              <span>{dislikes > 0 ? dislikes : ""}</span>
            </button>
            <span className="text-xs text-gray-400">•</span>
            <button
              onClick={() => setShowReplyForm((p) => !p)}
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
              {new Date(created_at).toLocaleDateString("id-ID", {
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
