// src/contexts/ArticleInteractionContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";
import {
  allArticlesData as initialArticlesStaticData,
  initialCommentsData,
  calculateTotalComments,
} from "../data/mockData";

const ArticleInteractionContext = createContext(null);

export const useArticleInteractions = () => {
  const context = useContext(ArticleInteractionContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useArticleInteractions must be used within an ArticleInteractionProvider"
    );
  }
  return context;
};

// Fungsi helper rekursif untuk update vote pada komentar/balasan
const updateCommentVoteRecursive = (commentList, targetCommentId, voteType) => {
  if (!Array.isArray(commentList)) return [];
  return commentList.map((comment) => {
    let newCommentData = {
      ...comment,
      likes: comment.likes || 0,
      dislikes: comment.dislikes || 0,
      userVoteOnComment: comment.userVoteOnComment || null,
      replies: comment.replies || [], // Pastikan replies selalu array
    };

    if (comment.id === targetCommentId) {
      if (voteType === "like") {
        if (newCommentData.userVoteOnComment === "liked") {
          newCommentData.likes = Math.max(0, newCommentData.likes - 1);
          newCommentData.userVoteOnComment = null;
        } else {
          newCommentData.likes = newCommentData.likes + 1;
          if (newCommentData.userVoteOnComment === "disliked") {
            newCommentData.dislikes = Math.max(0, newCommentData.dislikes - 1);
          }
          newCommentData.userVoteOnComment = "liked";
        }
      } else if (voteType === "dislike") {
        if (newCommentData.userVoteOnComment === "disliked") {
          newCommentData.dislikes = Math.max(0, newCommentData.dislikes - 1);
          newCommentData.userVoteOnComment = null;
        } else {
          newCommentData.dislikes = newCommentData.dislikes + 1;
          if (newCommentData.userVoteOnComment === "liked") {
            newCommentData.likes = Math.max(0, newCommentData.likes - 1);
          }
          newCommentData.userVoteOnComment = "disliked";
        }
      }
    } else if (newCommentData.replies && newCommentData.replies.length > 0) {
      const updatedReplies = updateCommentVoteRecursive(
        newCommentData.replies,
        targetCommentId,
        voteType
      );
      if (updatedReplies !== newCommentData.replies) {
        newCommentData.replies = updatedReplies;
      }
    }
    return newCommentData;
  });
};

// Fungsi helper rekursif untuk menambah balasan
const addReplyRecursive = (commentList, targetParentId, replyToAdd) => {
  if (!Array.isArray(commentList)) return [];
  return commentList.map((comment) => {
    let newCommentData = { ...comment, replies: comment.replies || [] };
    if (comment.id === targetParentId) {
      newCommentData.replies = [replyToAdd, ...newCommentData.replies];
    } else if (newCommentData.replies.length > 0) {
      const updatedReplies = addReplyRecursive(
        newCommentData.replies,
        targetParentId,
        replyToAdd
      );
      if (updatedReplies !== newCommentData.replies) {
        newCommentData.replies = updatedReplies;
      }
    }
    return newCommentData;
  });
};

export const ArticleInteractionProvider = ({ children }) => {
  const [articleInteractions, setArticleInteractions] = useState(() => {
    const interactions = {};
    Object.keys(initialArticlesStaticData).forEach((articleId) => {
      const article = initialArticlesStaticData[articleId];
      interactions[articleId] = {
        likes: article.initialLikes || 0,
        dislikes: article.initialDislikes || 0,
        userVote: null,
        isBookmarked: false,
      };
    });
    return interactions;
  });

  const [articleCommentsState, setArticleCommentsState] = useState(() => {
    const initialisedComments = {};
    Object.keys(initialCommentsData).forEach((articleId) => {
      const addVoteFieldRecursive = (commentsArray) => {
        if (!Array.isArray(commentsArray)) return [];
        return commentsArray.map((c) => ({
          ...c,
          userVoteOnComment: c.userVoteOnComment || null,
          likes: c.likes || 0,
          dislikes: c.dislikes || 0,
          replies: addVoteFieldRecursive(c.replies || []),
        }));
      };
      initialisedComments[articleId] = addVoteFieldRecursive(
        initialCommentsData[articleId] || []
      );
    });
    return initialisedComments;
  });

  const toggleLikeArticle = (articleId) => {
    setArticleInteractions((prev) => {
      const current = prev[articleId] || {
        likes: 0,
        dislikes: 0,
        userVote: null,
        isBookmarked: false,
      };
      let newLikes = current.likes;
      let newDislikes = current.dislikes;
      let newUserVote = current.userVote;
      let newIsBookmarked = current.isBookmarked;

      if (newUserVote === "liked") {
        newLikes = Math.max(0, newLikes - 1);
        newUserVote = null;
        newIsBookmarked = false;
      } else {
        newLikes++;
        if (newUserVote === "disliked") {
          newDislikes = Math.max(0, newDislikes - 1);
        }
        newUserVote = "liked";
        newIsBookmarked = true;
      }

      return {
        ...prev,
        [articleId]: {
          ...current,
          likes: newLikes,
          dislikes: newDislikes,
          userVote: newUserVote,
          isBookmarked: newIsBookmarked,
        },
      };
    });
  };

  const toggleDislikeArticle = (articleId) => {
    setArticleInteractions((prev) => {
      const current = prev[articleId] || {
        likes: 0,
        dislikes: 0,
        userVote: null,
        isBookmarked: false,
      };
      let newLikes = current.likes;
      let newDislikes = current.dislikes;
      let newUserVote = current.userVote;
      let newIsBookmarked = current.isBookmarked;

      if (newUserVote === "disliked") {
        newDislikes = Math.max(0, newDislikes - 1);
        newUserVote = null;
      } else {
        newDislikes++;
        if (newUserVote === "liked") {
          newLikes = Math.max(0, newLikes - 1);
          newIsBookmarked = false;
        }
        newUserVote = "disliked";
      }

      return {
        ...prev,
        [articleId]: {
          ...current,
          likes: newLikes,
          dislikes: newDislikes,
          userVote: newUserVote,
          isBookmarked: newIsBookmarked,
        },
      };
    });
  };

  const addCommentToArticle = (articleId, author, text) => {
    const newComment = {
      id: Date.now(),
      author: author.trim() === "" ? "Pengguna Anonim" : author,
      text,
      timestamp: Date.now(),
      avatarUrl: "/placeholder-avatar.png",
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
    };

    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: [newComment, ...(prev[articleId] || [])],
    }));
  };

  const addReplyToCommentContext = (
    articleId,
    parentCommentId,
    replyAuthor,
    replyText
  ) => {
    const newReply = {
      id: Date.now(),
      parentId: parentCommentId,
      author: replyAuthor.trim() === "" ? "Pengguna Anonim" : replyAuthor,
      text: replyText,
      timestamp: Date.now(),
      avatarUrl: "/placeholder-avatar.png",
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
    };

    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: addReplyRecursive(
        prev[articleId] || [],
        parentCommentId,
        newReply
      ),
    }));
  };

  const toggleLikeCommentContext = (articleId, commentId) => {
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateCommentVoteRecursive(
        prev[articleId] || [],
        commentId,
        "like"
      ),
    }));
  };

  const toggleDislikeCommentContext = (articleId, commentId) => {
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateCommentVoteRecursive(
        prev[articleId] || [],
        commentId,
        "dislike"
      ),
    }));
  };

  const getCommentCountForArticleContext = (articleId) => {
    return calculateTotalComments(articleCommentsState[articleId] || []);
  };

  const value = {
    articleInteractions,
    articleCommentsState,
    toggleLikeArticle,
    toggleDislikeArticle,
    addCommentToArticle,
    addReplyToComment: addReplyToCommentContext,
    toggleLikeComment: toggleLikeCommentContext,
    toggleDislikeComment: toggleDislikeCommentContext,
    getCommentCountForArticleContext,
    isArticleBookmarked: (articleId) =>
      !!articleInteractions[articleId]?.isBookmarked,
  };

  return (
    <ArticleInteractionContext.Provider value={value}>
      {children}
    </ArticleInteractionContext.Provider>
  );
};
