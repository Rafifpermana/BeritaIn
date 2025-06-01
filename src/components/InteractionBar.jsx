// src/components/InteractionBar.jsx
import React from "react";
import { ThumbsUp, ThumbsDown, Share2, MessageSquare } from "lucide-react";

const InteractionBar = ({
  articleTitle,
  articleUrl,
  likes = 0,
  dislikes = 0,
  userVote = null,
  isBookmarked = false,
  onLikeToggle,
  onDislikeToggle,
  commentCount = 0,
  onCommentClick,
}) => {
  const handleShare = async () => {
    const shareData = {
      title: articleTitle,
      text: `Lihat artikel menarik ini: ${articleTitle}`,
      url: articleUrl || window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard
          .writeText(shareData.url)
          .then(() => alert("URL artikel telah disalin ke clipboard!"))
          .catch((err) =>
            alert(
              "Gagal menyalin URL. Anda bisa salin manual: " + shareData.url
            )
          );
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error saat berbagi:", err);
        // alert('Gagal membagikan artikel.'); // Bisa di-uncomment jika ingin ada alert untuk semua error
      }
    }
  };

  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row items-center justify-between py-4 px-2 sm:px-0 border-b border-t border-gray-200">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onLikeToggle}
          aria-pressed={userVote === "liked"}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out
                      ${
                        userVote === "liked"
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
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
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out
                      ${
                        userVote === "disliked"
                          ? "bg-red-500 text-white shadow-md hover:bg-red-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                      }`}
        >
          <ThumbsDown
            size={18}
            className={userVote === "disliked" ? "fill-current" : ""}
          />
          <span>{dislikes > 0 ? dislikes : "Tidak Suka"}</span>
        </button>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        {onCommentClick && (
          <button
            onClick={onCommentClick}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 ease-in-out"
          >
            <MessageSquare size={18} />
            <span>Komentar ({commentCount})</span>
          </button>
        )}
        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 ease-in-out"
        >
          <Share2 size={18} />
          <span>Bagikan</span>
        </button>
      </div>
    </div>
  );
};
export default InteractionBar;
