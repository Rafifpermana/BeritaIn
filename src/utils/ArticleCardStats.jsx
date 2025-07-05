import React from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const ArticleCardStats = ({ likes, dislikes, comments }) => {
  return (
    <div className="flex items-center space-x-3 text-gray-500 mt-2">
      <div className="flex items-center space-x-1 text-xs">
        <ThumbsUp size={14} className="text-gray-400" />
        <span>{likes || 0}</span>
      </div>
      <div className="flex items-center space-x-1 text-xs">
        <ThumbsDown size={14} className="text-gray-400" />
        <span>{dislikes || 0}</span>
      </div>
      <div className="flex items-center space-x-1 text-xs">
        <MessageSquare size={14} className="text-gray-400" />
        <span>{comments || 0}</span>
      </div>
    </div>
  );
};

export default ArticleCardStats;
