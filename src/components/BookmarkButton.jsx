import React from "react";
import { Bookmark } from "lucide-react";
import { useArticleInteractions } from "../hooks/useArticleInteractions";
import { useAuth } from "../contexts/AuthContext";

const BookmarkButton = ({ article, className = "" }) => {
  const { articleInteractions, toggleBookmark } = useArticleInteractions();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  const isBookmarked = articleInteractions[article?.url]?.isBookmarked || false;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(article);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={
        isBookmarked ? "Hapus dari Bookmark" : "Tambahkan ke Bookmark"
      }
      title={isBookmarked ? "Hapus dari Bookmark" : "Tambahkan ke Bookmark"}
      className={`p-2 rounded-full transition-colors duration-200 ${className}`}
    >
      <Bookmark
        size={20}
        className={`transition-all duration-200 ${
          isBookmarked
            ? "fill-yellow-400 text-yellow-500"
            : "text-white hover:fill-yellow-300/50"
        }`}
      />
    </button>
  );
};

export default BookmarkButton;
