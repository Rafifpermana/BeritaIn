import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { MessageSquare } from "lucide-react";
import { likeComment, dislikeComment } from "../api/commentService";

const CommentSection = ({ comments = [], onAddComment, onAddReply }) => {
  const [localComments, setLocalComments] = useState(comments);

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Calculate total comments (including replies)
  const calculateTotalComments = (commentsList) => {
    return commentsList.reduce((total, comment) => {
      return (
        total +
        1 +
        (comment.replies ? calculateTotalComments(comment.replies) : 0)
      );
    }, 0);
  };

  // Update comment in nested structure
  const updateCommentInTree = (commentsList, commentId, updates) => {
    return commentsList.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, ...updates };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, updates),
        };
      }
      return comment;
    });
  };

  // Handle like comment
  const handleToggleLikeComment = async (commentId) => {
    try {
      const result = await likeComment(commentId);

      // Update local state
      setLocalComments((prevComments) =>
        updateCommentInTree(prevComments, commentId, {
          likes: result.likes,
          dislikes: result.dislikes,
          userVoteOnComment: result.userVote || null,
        })
      );
    } catch (error) {
      console.error("Error liking comment:", error);
      // Optionally show error message to user
    }
  };

  // Handle dislike comment
  const handleToggleDislikeComment = async (commentId) => {
    try {
      const result = await dislikeComment(commentId);

      // Update local state
      setLocalComments((prevComments) =>
        updateCommentInTree(prevComments, commentId, {
          likes: result.likes,
          dislikes: result.dislikes,
          userVoteOnComment: result.userVote || null,
        })
      );
    } catch (error) {
      console.error("Error disliking comment:", error);
      // Optionally show error message to user
    }
  };

  // Handle add comment (update local state)
  const handleAddComment = (author, content) => {
    // Create optimistic update
    const newComment = {
      id: Date.now(),
      author,
      content,
      created_at: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
    };

    // Add to local state immediately
    setLocalComments((prev) => [newComment, ...prev]);

    // Call parent handler
    if (onAddComment) {
      onAddComment(author, content);
    }
  };

  // Handle add reply (update local state)
  const handleAddReply = (parentId, author, content) => {
    const newReply = {
      id: Date.now(),
      author,
      content,
      created_at: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
    };

    // Add reply to local state
    setLocalComments((prevComments) =>
      updateCommentInTree(prevComments, parentId, {
        replies: [
          ...(prevComments.find((c) => c.id === parentId)?.replies || []),
          newReply,
        ],
      })
    );

    // Call parent handler
    if (onAddReply) {
      onAddReply(parentId, author, content);
    }
  };

  const totalComments = calculateTotalComments(localComments);

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
        <MessageSquare size={24} className="text-blue-600" />
        <span>Komentar ({totalComments})</span>
      </h3>

      <CommentForm onSubmitComment={handleAddComment} />

      <div className="mt-6 space-y-0 divide-y divide-gray-200">
        {localComments.length > 0 ? (
          localComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onAddReply={handleAddReply}
              onToggleLikeComment={handleToggleLikeComment}
              onToggleDislikeComment={handleToggleDislikeComment}
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
