import React from "react"; // Hapus useState dan useEffect jika tidak lagi digunakan di sini
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { MessageSquare } from "lucide-react";

const CommentSection = ({ articleId, comments = [], onAddComment }) => {
  // State 'comments' dan 'handleAddComment' sudah tidak ada di sini, dikelola oleh parent (DetailPage)

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <MessageSquare size={24} className="text-blue-600" />
        <span>Komentar ({comments.length})</span>
      </h3>

      {/* Teruskan fungsi onAddComment ke CommentForm */}
      <CommentForm onSubmitComment={onAddComment} />

      <div className="mt-6 space-y-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              author={comment.author}
              text={comment.text}
              timestamp={comment.timestamp}
              avatarUrl={comment.avatarUrl || "/placeholder-avatar.png"}
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
