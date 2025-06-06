// src/contexts/ArticleInteractionProvider.jsx
import React, { useState, useCallback } from "react";
import { ArticleInteractionContext } from "./ArticleInteractionContextDefinition";
import {
  allArticlesData as initialArticlesStaticData,
  initialCommentsData as rawInitialCommentsData,
  calculateTotalComments,
} from "../data/mockData";

const addReplyRecursive = (comments, parentId, newReply) => {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return { ...comment, replies: [newReply, ...(comment.replies || [])] };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyRecursive(comment.replies, parentId, newReply),
      };
    }
    return comment;
  });
};

const updateCommentVoteRecursive = (list, id, voteType) => {
  return list.map((comment) => {
    if (comment.id === id) {
      const newComment = { ...comment };
      const isLiked = newComment.userVoteOnComment === "liked";
      const isDisliked = newComment.userVoteOnComment === "disliked";

      if (voteType === "like") {
        newComment.likes = isLiked
          ? (newComment.likes || 1) - 1
          : (newComment.likes || 0) + 1;
        if (isDisliked) newComment.dislikes = (newComment.dislikes || 1) - 1;
        newComment.userVoteOnComment = isLiked ? null : "liked";
      } else {
        // 'dislike'
        newComment.dislikes = isDisliked
          ? (newComment.dislikes || 1) - 1
          : (newComment.dislikes || 0) + 1;
        if (isLiked) newComment.likes = (newComment.likes || 1) - 1;
        newComment.userVoteOnComment = isDisliked ? null : "disliked";
      }
      return newComment;
    }
    if (comment.replies?.length > 0) {
      return {
        ...comment,
        replies: updateCommentVoteRecursive(comment.replies, id, voteType),
      };
    }
    return comment;
  });
};

export const ArticleInteractionProvider = ({ children }) => {
  const [articleInteractions, setArticleInteractions] = useState(() => {
    const interactions = {};
    Object.keys(initialArticlesStaticData).forEach((id) => {
      const article = initialArticlesStaticData[id];
      interactions[id] = {
        likes: article.initialLikes || 0,
        dislikes: article.initialDislikes || 0,
        userVote: null,
        isBookmarked: false,
      };
    });
    return interactions;
  });

  const [articleCommentsState, setArticleCommentsState] = useState(
    rawInitialCommentsData
  );

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Selamat datang di BeritaIn!",
      type: "info",
      timestamp: new Date().toISOString(),
      read: true,
      link: "#",
    },
  ]);
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((message, link = "#", type = "info") => {
    const newNotification = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link,
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
  }, []);

  const deleteNotification = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationId
      )
    );
  };

  const toggleBookmark = (articleId) => {
    const isCurrentlyBookmarked = articleInteractions[articleId]?.isBookmarked;
    setArticleInteractions((prev) => ({
      ...prev,
      [articleId]: { ...prev[articleId], isBookmarked: !isCurrentlyBookmarked },
    }));
    if (!isCurrentlyBookmarked) {
      addNotification(
        `Artikel "${initialArticlesStaticData[articleId]?.title}" ditambahkan ke bookmark.`,
        "/user/dashboard/bookmarks"
      );
    } else {
      addNotification(
        `Artikel "${initialArticlesStaticData[articleId]?.title}" dihapus dari bookmark.`,
        "/user/dashboard/bookmarks"
      );
    }
  };

  const toggleLikeArticle = (articleId) => {
    setArticleInteractions((prev) => {
      const current = prev[articleId];
      const isLiked = current.userVote === "liked";
      return {
        ...prev,
        [articleId]: {
          ...current,
          likes: isLiked ? current.likes - 1 : current.likes + 1,
          dislikes:
            current.userVote === "disliked"
              ? current.dislikes - 1
              : current.dislikes,
          userVote: isLiked ? null : "liked",
        },
      };
    });
  };

  const toggleDislikeArticle = (articleId) => {
    setArticleInteractions((prev) => {
      const current = prev[articleId];
      const isDisliked = current.userVote === "disliked";
      return {
        ...prev,
        [articleId]: {
          ...current,
          dislikes: isDisliked ? current.dislikes - 1 : current.dislikes + 1,
          likes:
            current.userVote === "liked" ? current.likes - 1 : current.likes,
          userVote: isDisliked ? null : "disliked",
        },
      };
    });
  };

  const addCommentToArticle = (articleId, authorName, text, currentUser) => {
    const newComment = {
      id: Date.now(),
      articleId,
      userId: currentUser.id,
      author: authorName,
      text,
      timestamp: Date.now(),
      avatarUrl: currentUser.avatarUrl,
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
      status: "approved",
    };
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: [newComment, ...(prev[articleId] || [])],
    }));
    addNotification(
      `${authorName} mengomentari: "${initialArticlesStaticData[articleId]?.title}"`,
      `/article/${articleId}#comment-section`
    );
  };

  const addReplyToComment = (
    articleId,
    parentId,
    authorName,
    text,
    currentUser
  ) => {
    const newReply = {
      id: Date.now(),
      parentId,
      articleId,
      userId: currentUser.id,
      author: authorName,
      text,
      timestamp: Date.now(),
      avatarUrl: currentUser.avatarUrl,
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
    };
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: addReplyRecursive(prev[articleId] || [], parentId, newReply),
    }));
    addNotification(
      `${authorName} membalas komentar Anda.`,
      `/article/${articleId}#comment-${newReply.id}`
    );
  };

  const toggleCommentLike = (articleId, commentId) =>
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateCommentVoteRecursive(
        prev[articleId] || [],
        commentId,
        "like"
      ),
    }));
  const toggleCommentDislike = (articleId, commentId) =>
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateCommentVoteRecursive(
        prev[articleId] || [],
        commentId,
        "dislike"
      ),
    }));
  const getCommentCountForArticleContext = useCallback(
    (articleId) =>
      calculateTotalComments(articleCommentsState[articleId] || []),
    [articleCommentsState]
  );
  const markNotificationAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const markAllNotificationsAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const value = {
    articleInteractions,
    articleCommentsState,
    notifications,
    unreadNotificationCount,
    toggleLikeArticle,
    toggleDislikeArticle,
    toggleBookmark,
    addCommentToArticle,
    addReplyToComment,
    toggleCommentLike,
    toggleCommentDislike,
    getCommentCountForArticleContext,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    deleteNotification,
  };

  return (
    <ArticleInteractionContext.Provider value={value}>
      {children}
    </ArticleInteractionContext.Provider>
  );
};
