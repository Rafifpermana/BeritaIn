// src/components/ArticleCardStats.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const ArticleCardStats = ({
  likes,
  dislikes,
  commentCount,
  articleId,
  small = false, // Prop untuk versi yang lebih kecil jika diperlukan
}) => {
  const iconSize = small ? 12 : 14;
  // Untuk ukuran teks, kita bisa buat konsisten atau bisa juga dikontrol prop 'small'
  // Di sini saya akan buat konsisten dengan text-xs untuk kesederhanaan di HomePage
  const textSize = "text-xs";
  const spacing = small ? "space-x-2" : "space-x-2.5"; // Sedikit penyesuaian spasi

  // Memberikan nilai default 0 jika props tidak ada atau undefined
  const displayLikes = typeof likes === "number" ? likes : 0;
  const displayDislikes = typeof dislikes === "number" ? dislikes : 0;
  const displayCommentCount =
    typeof commentCount === "number" ? commentCount : 0;

  return (
    <div
      className={`flex items-center ${spacing} mt-1.5 ${textSize} text-gray-500`}
    >
      {" "}
      {/* mt-1.5 untuk jarak dari meta */}
      <div
        className="flex items-center space-x-1"
        title={`${displayLikes} Suka`}
      >
        <ThumbsUp size={iconSize} className="text-gray-400" />
        <span>{displayLikes}</span>
      </div>
      <div
        className="flex items-center space-x-1"
        title={`${displayDislikes} Tidak Suka`}
      >
        <ThumbsDown size={iconSize} className="text-gray-400" />
        <span>{displayDislikes}</span>
      </div>
      {/* Hanya tampilkan link komentar jika articleId ada */}
      {articleId && (
        <Link
          to={`/article/${articleId}#comment-section`}
          className="flex items-center space-x-1 hover:text-blue-600 hover:underline"
          title={`${displayCommentCount} Komentar`}
        >
          <MessageSquare
            size={iconSize}
            className="text-gray-400 group-hover:text-blue-600"
          />
          <span>{displayCommentCount}</span>
        </Link>
      )}
      {/* Jika tidak ada articleId (misal untuk item yang bukan link ke detail), tampilkan saja jumlahnya */}
      {!articleId && displayCommentCount > 0 && (
        <div
          className="flex items-center space-x-1"
          title={`${displayCommentCount} Komentar`}
        >
          <MessageSquare size={iconSize} className="text-gray-400" />
          <span>{displayCommentCount}</span>
        </div>
      )}
    </div>
  );
};

export default ArticleCardStats;
