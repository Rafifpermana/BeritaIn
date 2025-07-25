import React, { useState } from "react";
import { Send, Info } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UserAvatar from "./UserAvatar";

const CommentForm = ({ onSubmitComment }) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");

  const MIN_POINTS_TO_COMMENT = 50;
  const isGuest = !currentUser;

  const canComment = !isGuest && currentUser.points >= MIN_POINTS_TO_COMMENT;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isGuest) {
      alert("Anda harus login untuk berkomentar.");
      return;
    }
    if (!canComment) {
      alert(
        `Poin Anda tidak cukup. Diperlukan minimal ${MIN_POINTS_TO_COMMENT} poin untuk berkomentar.`
      );
      return;
    }
    if (commentText.trim() === "") return;

    onSubmitComment(currentUser.name, commentText);
    setCommentText("");
  };

  const getPlaceholderText = () => {
    if (isGuest) return "Silakan login untuk dapat berkomentar.";
    if (!canComment) return "Poin Anda tidak cukup untuk berkomentar.";
    return "Tulis komentar Anda di sini...";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 mb-8 p-4 bg-gray-50 rounded-lg shadow"
    >
      <div className="flex items-start space-x-3">
        {currentUser && <UserAvatar name={currentUser.name} size="w-10 h-10" />}

        <div className="flex-grow">
          {currentUser && (
            <p className="text-sm font-semibold text-gray-800 mb-2">
              {currentUser.name}
            </p>
          )}

          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={getPlaceholderText()}
            rows="3"
            required
            disabled={isGuest || !canComment}
            className={`w-full px-3 py-2 text-sm border rounded-md resize-none transition-colors
                        ${
                          isGuest || !canComment
                            ? "bg-gray-200 cursor-not-allowed placeholder-red-500"
                            : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        }`}
          />

          {!isGuest && !canComment && (
            <div className="mt-2 flex items-center text-xs text-red-600 bg-red-100 border border-red-200 p-2 rounded-md">
              <Info size={16} className="mr-2 flex-shrink-0" />
              <span>
                Anda memerlukan {MIN_POINTS_TO_COMMENT} poin untuk berkomentar.
                Poin Anda saat ini: {currentUser.points}.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isGuest || !canComment}
            className={`mt-3 flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
                        ${
                          canComment && !isGuest
                            ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
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
