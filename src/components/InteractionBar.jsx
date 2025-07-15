import React from "react";
import { ThumbsUp, ThumbsDown, Share2, MessageSquare } from "lucide-react";
import BookmarkButton from "./BookmarkButton";

const InteractionBar = ({
  article,
  likes = 0,
  dislikes = 0,
  userVote = null,
  onLikeToggle,
  onDislikeToggle,
  commentCount = 0,
  onCommentClick,
}) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article,
          text: `Lihat artikel ini: ${article}`,
          url: article || window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(article || window.location.href);
        alert("URL artikel telah disalin ke clipboard!");
      }
    } catch (err) {
      console.error("Error saat berbagi:", err);
    }
  };

  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row items-center justify-between py-4 px-2 sm:px-0 border-b border-t border-gray-200">
      {/* Kolom Suka & Tidak Suka */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onLikeToggle}
          aria-pressed={userVote === "liked"}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            userVote === "liked"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ThumbsUp
            size={18}
            className={userVote === "liked" ? "fill-current" : ""}
          />
          <span>{likes > 0 ? likes : "Suka"}</span>
        </button>
        <button
          onClick={onDislikeToggle}
          aria-pressed={userVote === "disliked"}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            userVote === "disliked"
              ? "bg-red-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ThumbsDown
            size={18}
            className={userVote === "disliked" ? "fill-current" : ""}
          />
          <span>{dislikes > 0 ? dislikes : "Tidak Suka"}</span>
        </button>
      </div>
      {/* Kolom Aksi Lainnya */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {onCommentClick && (
          <button
            onClick={onCommentClick}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <MessageSquare size={18} />
            <span>Komentar ({commentCount})</span>
          </button>
        )}
        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <Share2 size={18} />
          <span>Bagikan</span>
        </button>

        {/* Tombol Bookmark Baru Ditambahkan di Sini */}
        {article && (
          <div className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200">
            <BookmarkButton
              article={article}
              className="text-black hover:text-gray-700 [&>svg]:text-black [&>svg]:hover:text-gray-700"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionBar;
