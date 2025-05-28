import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2, MessageSquare } from "lucide-react";

const InteractionBar = ({
  articleTitle,
  articleUrl,
  initialLikes = 0,
  initialDislikes = 0,
  commentCount = 0, // Prop baru untuk jumlah komentar
  onCommentClick,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState(null); // null, 'liked', 'disliked'

  useEffect(() => {
    setLikes(initialLikes);
    setDislikes(initialDislikes);
  }, [initialLikes, initialDislikes]);

  const handleLike = () => {
    if (userVote === "liked") {
      setLikes(likes - 1);
      setUserVote(null);
    } else {
      setLikes(likes + 1);
      if (userVote === "disliked") {
        setDislikes(dislikes - 1);
      }
      setUserVote("liked");
    }
  };

  const handleDislike = () => {
    if (userVote === "disliked") {
      setDislikes(dislikes - 1);
      setUserVote(null);
    } else {
      setDislikes(dislikes + 1);
      if (userVote === "liked") {
        setLikes(likes - 1);
      }
      setUserVote("disliked");
    }
  };

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
        alert("Gagal membagikan artikel.");
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-2 sm:px-0 border-b border-t border-gray-200">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-0">
        <button
          onClick={handleLike}
          aria-pressed={userVote === "liked"}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out
                      ${
                        userVote === "liked"
                          ? "bg-blue-500 text-white shadow-md"
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
          onClick={handleDislike}
          aria-pressed={userVote === "disliked"}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out
                      ${
                        userVote === "disliked"
                          ? "bg-red-500 text-white shadow-md"
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
            {/* Menampilkan jumlah komentar */}
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
