// src/contexts/ArticleInteractionProvider.jsx
import React, { useState } from "react";
// Impor ArticleInteractionContext dari file definisinya
import { ArticleInteractionContext } from "./ArticleInteractionContextDefinition";
import {
  allArticlesData as initialArticlesStaticData,
  initialCommentsData as rawInitialCommentsData, // Diberi alias agar bisa diproses
  calculateTotalComments,
  allUsersData, // Jika Anda memiliki data pengguna di mockData untuk avatar, dll.
} from "../data/mockData";

// --- Fungsi Helper Internal ---
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

const containsBadWords = (text) => {
  const badWords = [
    "jelek",
    "buruk",
    "bodoh",
    "spam",
    "kasar",
    "anjing",
    "bangsat",
  ]; // Sesuaikan daftar ini
  const lowerText = text.toLowerCase();
  return badWords.some((word) => lowerText.includes(word));
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
    Object.keys(rawInitialCommentsData).forEach((articleId) => {
      const addInitialFieldsRecursive = (commentsArray) => {
        if (!Array.isArray(commentsArray)) return [];
        return commentsArray.map((c) => ({
          ...c,
          userId: c.userId || "guest_user", // Pastikan ada userId
          status: c.status || "approved", // Default status
          userVoteOnComment: c.userVoteOnComment || null,
          likes: c.likes || 0,
          dislikes: c.dislikes || 0,
          replies: addInitialFieldsRecursive(c.replies || []),
        }));
      };
      initialisedComments[articleId] = addInitialFieldsRecursive(
        rawInitialCommentsData[articleId] || []
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

  // State untuk Poin Pengguna (SIMULASI, idealnya dari UserContext atau AuthContext)
  const [userPointsMap, setUserPointsMap] = useState(() => {
    const points = {};
    allUsersData.forEach((user) => {
      points[user.id] = user.points;
    });
    return points;
  });

  const deductUserPoints = (userId, amount) => {
    setUserPointsMap((prevPoints) => {
      const currentPoints = prevPoints[userId] || 0;
      const newPoints = Math.max(0, currentPoints - amount);
      // Notifikasi ke pengguna yang poinnya dikurangi (simulasi)
      addNotification(
        `Peringatan: Poin Anda dikurangi ${amount} karena komentar yang tidak sesuai. Poin Anda sekarang: ${newPoints}.`,
        `/dashboard/user/points`
      );
      return { ...prevPoints, [userId]: newPoints };
    });
    console.log(`Poin untuk user ${userId} dikurangi ${amount}.`);
  };

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

  const addCommentToArticle = (articleId, author, text, userId = "user001") => {
    // Asumsi userId dari user yg login
    const articleTitle =
      initialArticlesStaticData[articleId]?.title || "sebuah artikel";
    const initialStatus = containsBadWords(text)
      ? "pending_review"
      : "approved";
    const userMakingComment = allUsersData.find((u) => u.id === userId);

    const newComment = {
      id: Date.now(),
      articleId,
      userId,
      author:
        author.trim() === ""
          ? userMakingComment?.name || "Pengguna Anonim"
          : author,
      text,
      timestamp: Date.now(),
      avatarUrl: userMakingComment?.avatarUrl || "/placeholder-avatar.png",
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
      status: initialStatus,
    };
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: [newComment, ...(prev[articleId] || [])],
    }));
    if (initialStatus === "pending_review") {
      addNotification(
        `Komentar baru dari ${newComment.author} di artikel "${articleTitle}" menunggu moderasi.`,
        `/admin/dashboard/comments`
      );
    }
  };

  const addReplyToCommentContext = (
    articleId,
    parentCommentId,
    replyAuthor,
    replyText,
    userId = "user001"
  ) => {
    const articleTitle =
      initialArticlesStaticData[articleId]?.title || "sebuah artikel";
    const initialStatus = containsBadWords(replyText)
      ? "pending_review"
      : "approved";
    const userMakingReply = allUsersData.find((u) => u.id === userId);

    const newReply = {
      id: Date.now(),
      parentId: parentCommentId,
      articleId,
      userId,
      author:
        replyAuthor.trim() === ""
          ? userMakingReply?.name || "Pengguna Anonim"
          : replyAuthor,
      text: replyText,
      timestamp: Date.now(),
      avatarUrl: userMakingReply?.avatarUrl || "/placeholder-avatar.png",
      likes: 0,
      dislikes: 0,
      userVoteOnComment: null,
      replies: [],
      status: initialStatus,
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
      `Balasan baru dari ${newReply.author} di artikel "${articleTitle}" ${
        initialStatus === "pending_review" ? "menunggu moderasi" : ""
      }.`,
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

  // Fungsi untuk moderasi oleh Admin
  const moderateComment = (
    articleId,
    commentId,
    newStatus,
    commentAuthorUserId
  ) => {
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateCommentVoteRecursive(
        prev[articleId] || [],
        commentId,
        "status-update",
        newStatus
      ), // Perlu modifikasi updateCommentVoteRecursive
    }));
    // Untuk sementara, modifikasi updateCommentVoteRecursive agar bisa handle 'status-update' atau buat fungsi baru
    // Alternatif: buat fungsi updateCommentStatusRecursive
    const updateStatusOnlyRecursive = (commentList, targetId, statusToSet) => {
      if (!commentList) return [];
      return commentList.map((c) => {
        let newC = { ...c };
        if (c.id === targetId) {
          newC.status = statusToSet;
        }
        if (c.replies && c.replies.length > 0) {
          newC.replies = updateStatusOnlyRecursive(
            c.replies,
            targetId,
            statusToSet
          );
        }
        return newC;
      });
    };
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateStatusOnlyRecursive(
        prev[articleId] || [],
        commentId,
        newStatus
      ),
    }));

    if (newStatus === "rejected" && commentAuthorUserId) {
      const pointsToDeduct = 10;
      deductUserPoints(commentAuthorUserId, pointsToDeduct);
      addNotification(
        `Komentar Anda pada artikel "${
          initialArticlesStaticData[articleId]?.title || "sebuah artikel"
        }" ditolak. Poin Anda dikurangi.`,
        `/dashboard/user/guidelines`
      );
    } else if (newStatus === "approved" && commentAuthorUserId) {
      addNotification(
        `Komentar Anda pada artikel "${
          initialArticlesStaticData[articleId]?.title || "sebuah artikel"
        }" telah disetujui.`,
        `/article/${articleId}#comment-${commentId}`
      );
    }
    console.log(
      `Admin: Komentar ${commentId} di artikel ${articleId} statusnya diubah menjadi ${newStatus}`
    );
  };

  const deleteCommentContext = (
    articleId,
    commentId,
    commentAuthorUserId,
    isNegative = false
  ) => {
    const deleteRecursive = (commentList, targetId) => {
      if (!commentList) return [];
      const filtered = commentList.filter((c) => c.id !== targetId);
      return filtered.map((c) => {
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: deleteRecursive(c.replies, targetId) };
        }
        return c;
      });
    };
    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: deleteRecursive(prev[articleId] || [], commentId),
    }));

    if (isNegative && commentAuthorUserId) {
      const pointsToDeduct = 15;
      deductUserPoints(commentAuthorUserId, pointsToDeduct);
    }
    addNotification(
      `Sebuah komentar pada artikel "${
        initialArticlesStaticData[articleId]?.title || "sebuah artikel"
      }" telah dihapus oleh admin.`,
      `/article/${articleId}`
    );
    console.log(
      `Admin: Komentar ${commentId} di artikel ${articleId} dihapus.`
    );
  };

  const value = {
    articleInteractions,
    articleCommentsState,
    notifications,
    unreadNotificationCount,
    userPointsMap, // Ekspor userPointsMap
    toggleLikeArticle,
    toggleDislikeArticle,
    addCommentToArticle,
    addReplyToComment: addReplyToCommentContext,
    toggleCommentLike,
    toggleCommentDislike,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getCommentCountForArticleContext,
    isArticleBookmarked: (articleId) =>
      !!articleInteractions[articleId]?.isBookmarked,
    moderateComment,
    deleteCommentContext,
    deductUserPoints,
  };

  return (
    <ArticleInteractionContext.Provider value={value}>
      {children}
    </ArticleInteractionContext.Provider>
  );
};
