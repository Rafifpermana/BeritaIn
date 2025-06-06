// src/components/CommentSection.jsx
import React from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { MessageSquare } from "lucide-react";
import { calculateTotalComments } from "../data/mockData";

const CommentSection = ({
  comments = [],
  onAddComment,
  onAddReply,
  onToggleLikeComment,
  onToggleDislikeComment,
}) => {
  const totalComments = calculateTotalComments(comments);

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <MessageSquare size={24} className="text-blue-600" />
        <span>Komentar ({totalComments})</span>
      </h3>

      <CommentForm onSubmitComment={onAddComment} />

      <div className="mt-6 space-y-0 divide-y divide-gray-200">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onAddReply={onAddReply}
              onToggleLikeComment={onToggleLikeComment}
              onToggleDislikeComment={onToggleDislikeComment}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
