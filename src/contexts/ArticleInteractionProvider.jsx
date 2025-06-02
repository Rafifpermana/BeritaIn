import React, { useState } from "react";
import { ArticleInteractionContext } from "./ArticleInteractionContextDefinition"; // Impor konteks dari definisi
import {
  allArticlesData as initialArticlesStaticData,
  initialCommentsData,
  calculateTotalComments,
} from "../data/mockData"; // Pastikan mockData.js tidak ada error sintaks juga

// --- Fungsi Helper (bisa tetap di sini atau dipindah ke utils jika sangat umum) ---
const updateCommentVoteRecursive = (commentList, targetCommentId, voteType) => {
  if (!Array.isArray(commentList)) return [];
  return commentList.map((comment) => {
    let newCommentData = {
      ...comment,
      likes: comment.likes || 0,
      dislikes: comment.dislikes || 0,
      userVoteOnComment: comment.userVoteOnComment || null,
      replies: comment.replies || [],
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

const addReplyRecursive = (commentList, targetParentId, replyToAdd) => {
  if (!Array.isArray(commentList)) return [];
  return commentList.map((comment) => {
    let newCommentData = { ...comment, replies: comment.replies || [] };
    if (comment.id === targetParentId) {
      newCommentData.replies = [replyToAdd, ...newCommentData.replies];
    } else if (newCommentData.replies.length > 0) {
      const updatedChildReplies = addReplyRecursive(
        newCommentData.replies,
        targetParentId,
        replyToAdd
      );
      if (updatedChildReplies !== newCommentData.replies) {
        newCommentData.replies = updatedChildReplies;
      }
    }
    return newCommentData;
  });
};
// --- Akhir Fungsi Helper ---

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
      const addInitialFieldsRecursive = (commentsArray) => {
        if (!Array.isArray(commentsArray)) return [];
        return commentsArray.map((c) => ({
          ...c,
          userVoteOnComment: c.userVoteOnComment || null,
          likes: c.likes || 0,
          dislikes: c.dislikes || 0,
          replies: addInitialFieldsRecursive(c.replies || []),
        }));
      };
      initialisedComments[articleId] = addInitialFieldsRecursive(
        initialCommentsData[articleId] || []
      );
    });
    return initialisedComments;
  });

  const [notifications, setNotifications] = useState([
    {
      id: Date.now() + 1,
      message: "Selamat datang di sistem notifikasi baru!",
      timestamp: new Date().toISOString(),
      read: false,
      link: "#",
    },
    {
      id: Date.now() + 2,
      message: "Ada update pada artikel 'AI Poetry'.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: true,
      link: "/article/ai-poetry",
    },
  ]);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addNotification = (message, link = "#") => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      read: false,
      link,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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
        if (newUserVote === "disliked")
          newDislikes = Math.max(0, newDislikes - 1);
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
    const articleTitle =
      initialArticlesStaticData[articleId]?.title || "sebuah artikel";
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
    addNotification(
      `Balasan baru dari ${replyAuthor} di artikel "${articleTitle}"`,
      `/article/${articleId}#comment-${newReply.id}`
    );
  };

  const toggleCommentLike = (articleId, commentId) => {
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateCommentVoteRecursive(
        prev[articleId] || [],
        commentId,
        "like"
      ),
    }));
  };

  const toggleCommentDislike = (articleId, commentId) => {
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
    notifications,
    unreadNotificationCount,
    toggleLikeArticle,
    toggleDislikeArticle,
    addCommentToArticle,
    addReplyToComment: addReplyToCommentContext,
    toggleCommentLike, // Fungsi untuk like/dislike komentar
    toggleCommentDislike, // Fungsi untuk like/dislike komentar
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
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
