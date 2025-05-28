import React from "react";
import { ThumbsUp, MessageSquare } from "lucide-react"; // Ikon untuk like/reply di komentar

const CommentItem = ({
  author,
  text,
  timestamp,
  avatarUrl = "/placeholder-avatar.png",
}) => {
  return (
    <div className="flex items-start space-x-3 py-4 border-b border-gray-100 last:border-b-0">
      <img
        src={avatarUrl}
        alt={`Avatar ${author}`}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-grow">
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800 hover:underline cursor-pointer">
              {author}
            </p>
            {/* Placeholder untuk menu opsi komentar (...) */}
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{text}</p>
        </div>
        <div className="flex items-center space-x-3 mt-1.5 pl-1">
          <button className="text-xs text-gray-500 hover:text-blue-600 font-medium flex items-center space-x-1">
            <ThumbsUp size={14} />
            <span>Suka</span>
            {/* Counter like komentar bisa ditambahkan di sini */}
          </button>
          <span className="text-xs text-gray-400">•</span>
          <button className="text-xs text-gray-500 hover:text-blue-600 font-medium flex items-center space-x-1">
            <MessageSquare size={14} />
            <span>Balas</span>
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
        {/* Placeholder untuk balasan komentar bisa di-render di sini */}
      </div>
    </div>
  );
};

export default CommentItem;
