// src/components/CommentSection.jsx
import React from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem"; // Pastikan CommentItem diimpor
import { MessageSquare } from "lucide-react";

const CommentSection = ({
  articleId,
  comments = [],
  onAddComment,
  onAddReply,
}) => {
  // Tambah onAddReply
  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <MessageSquare size={24} className="text-blue-600" />
        <span>Komentar ({comments.length})</span>
      </h3>

      <CommentForm onSubmitComment={onAddComment} />

      <div className="mt-6 space-y-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment} // Teruskan seluruh objek komentar
              onAddReply={onAddReply} // Teruskan fungsi ini
              // Anda juga bisa menambahkan level indentasi jika diperlukan untuk balasan dari balasan
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
