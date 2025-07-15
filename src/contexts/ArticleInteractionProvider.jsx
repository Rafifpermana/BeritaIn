import React, { useState, useCallback } from "react";
import { ArticleInteractionContext } from "./ArticleInteractionContextDefinition";
import apiClient from "../api/axios";

const API_BASE_URL = "http://localhost:8000/api";

// --- Fungsi Helper (tidak diubah) ---
const addReplyRecursive = (comments, parentId, newReply) => {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return { ...comment, replies: [newReply, ...(comment.replies || [])] };
    }
    if (comment.replies?.length > 0) {
      return {
        ...comment,
        replies: addReplyRecursive(comment.replies, parentId, newReply),
      };
    }
    return comment;
  });
};

const countCommentsRecursive = (comments) => {
  let count = 0;
  if (!comments || comments.length === 0) {
    return 0;
  }
  for (const comment of comments) {
    count++; // Hitung komentar utama
    if (comment.replies && comment.replies.length > 0) {
      count += countCommentsRecursive(comment.replies); // Tambahkan jumlah balasan
    }
  }
  return count;
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
  const [articleInteractions, setArticleInteractions] = useState({});
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [articleCommentsState, setArticleCommentsState] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [userPointsMap, setUserPointsMap] = useState({});

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

  const loadInitialInteractions = useCallback(async (articleUrl) => {
    try {
      // Panggil endpoint GET untuk data interaksi (like, dislike, bookmark)
      const response = await apiClient.get(
        `${API_BASE_URL}/interactions/article`,
        {
          params: { article_url: articleUrl },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        const { likes_count, dislikes_count, user_vote, is_bookmarked } =
          response.data.data;
        setArticleInteractions((prev) => ({
          ...prev,
          [articleUrl]: {
            likes: likes_count,
            dislikes: dislikes_count,
            userVote: user_vote,
            isBookmarked: is_bookmarked,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to load article interactions:", error);
    }
  }, []);

  const loadComments = useCallback(async (articleUrl) => {
    try {
      // Panggil endpoint GET untuk data komentar
      const response = await apiClient.get(
        `${API_BASE_URL}/interactions/comments`,
        {
          params: { article_url: articleUrl },
        }
      );

      if (response.data.success) {
        // Langsung gunakan data komentar dari backend
        setArticleCommentsState((prev) => ({
          ...prev,
          [articleUrl]: response.data.data,
        }));
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  }, []);

  // Helper function to get article data from URL
  const getArticleDataFromUrl = (articleUrl) => {
    // Fungsi ini sekarang hanya sebagai fallback untuk mengirim URL ke backend.
    // Detail artikel akan diisi oleh backend.
    return {
      url: articleUrl,
      title: "Article from Client",
      description: "",
      image: "",
      source_name: "External",
      pubDate: new Date().toISOString(),
    };
  };

  const toggleBookmark = async (articleData) => {
    // Parameter sudah berupa objek
    try {
      // Panggil API dengan payload yang sesuai
      const response = await apiClient.post(`/interactions/bookmark`, {
        article: {
          // Pastikan payload sesuai dengan yang dibutuhkan backend
          url: articleData.url,
          title: articleData.title,
          description: articleData.description || articleData.excerpt || "",
          image: articleData.image || "",
          source_name: articleData.source_name || "By Tim Redaksi",
          pubDate:
            articleData.pubDate ||
            articleData.published_at ||
            new Date().toISOString(),
        },
      });

      const isBookmarked = response.data.bookmarked;
      setArticleInteractions((prev) => ({
        ...prev,
        [articleData.url]: {
          // Gunakan URL sebagai key
          ...prev[articleData.url],
          isBookmarked,
        },
      }));

      // Logika notifikasi tetap sama
      if (isBookmarked) {
        addNotification(
          `Artikel ditambahkan ke bookmark.`,
          "/user/dashboard/bookmarks"
        );
      } else {
        addNotification(
          `Artikel dihapus dari bookmark.`,
          "/user/dashboard/bookmarks"
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      addNotification("Gagal mengubah bookmark. Coba lagi.", "#", "error");
    }
  };

  const fetchBookmarkedArticles = useCallback(async () => {
    try {
      // Panggil endpoint yang sudah ada di backend Anda
      const response = await apiClient.get("/user/bookmarks");

      // Kita hanya butuh data artikel dari setiap bookmark
      const articles = response.data.data.map((bookmark) => bookmark.article);
      setBookmarkedArticles(articles);
    } catch (error) {
      console.error("Failed to fetch bookmarked articles:", error);
      // Anda bisa menambahkan notifikasi error di sini jika perlu
      addNotification("Gagal memuat artikel yang disimpan.", "#", "error");
    }
  }, [addNotification]);

  const toggleLikeArticle = async (articleData) => {
    try {
      const response = await apiClient.post(`/interactions/vote`, {
        article: {
          url: articleData.url,
          title: articleData.title,
          description: articleData.excerpt || "",
          image: articleData.image || "",
          source_name: articleData.source_name || "By Tim Redaksi",
          pubDate: articleData.published_at || new Date().toISOString(),
        },
        type: "like",
      });

      const { likes_count, dislikes_count, current_vote } = response.data;
      setArticleInteractions((prev) => ({
        ...prev,
        [articleData.url]: {
          ...prev[articleData.url],
          likes: likes_count,
          dislikes: dislikes_count,
          userVote: current_vote,
        },
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
      addNotification(
        "Gagal memberikan like. Silakan coba lagi.",
        "#",
        "error"
      );
    }
  };

  const toggleDislikeArticle = async (articleData) => {
    try {
      const response = await apiClient.post(`/interactions/vote`, {
        article: {
          url: articleData.url,
          title: articleData.title,
          description: articleData.excerpt || "",
          image: articleData.image || "",
          source_name: articleData.source_name || "By Tim Redaksi",
          pubDate: articleData.published_at || new Date().toISOString(),
        },
        type: "dislike",
      });

      // Update local state immediately for better UX
      const { likes_count, dislikes_count, current_vote } = response.data;
      setArticleInteractions((prev) => ({
        ...prev,
        [articleData.url]: {
          ...prev[articleData.url],
          likes: likes_count,
          dislikes: dislikes_count,
          userVote: current_vote,
        },
      }));
    } catch (error) {
      console.error("Error toggling dislike:", error);
      addNotification("Gagal memberikan dislike. Coba lagi.", "#", "error");
    }
  };

  const addCommentToArticle = async (articleData, text) => {
    try {
      const response = await apiClient.post(`/interactions/comment`, {
        article: {
          url: articleData.url,
          title: articleData.title,
          description: articleData.excerpt || "",
          image: articleData.image || "",
          source_name: articleData.source_name || "By Tim Redaksi",
          pubDate: articleData.published_at || new Date().toISOString(),
        },
        content: text,
        parent_id: null,
      });

      const newCommentFromServer = response.data;
      setArticleCommentsState((prev) => ({
        ...prev,
        [articleData.url]: [
          newCommentFromServer,
          ...(prev[articleData.url] || []),
        ],
      }));

      addNotification(
        `${newCommentFromServer.user.name} mengomentari artikel`,
        `/article/${articleData.url.split("/").pop()}#comment-section`
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      addNotification("Gagal menambahkan komentar. Coba lagi.", "#", "error");
    }
  };

  const addReplyToComment = async (articleData, parentId, text) => {
    try {
      const response = await apiClient.post(`/interactions/comment`, {
        article: {
          url: articleData.url,
          title: articleData.title,
          description: articleData.excerpt || "",
          image: articleData.image || "",
          source_name: articleData.source_name || "By Tim Redaksi",
          pubDate: articleData.published_at || new Date().toISOString(),
        },
        content: text,
        parent_id: parentId,
      });

      const newReplyFromServer = response.data;
      setArticleCommentsState((prev) => ({
        ...prev,
        [articleData.url]: addReplyRecursive(
          prev[articleData.url] || [],
          parentId,
          newReplyFromServer
        ),
      }));

      addNotification(
        `${newReplyFromServer.user.name} membalas komentar Anda.`,
        `/article/${articleData.url.split("/").pop()}#comment-${
          newReplyFromServer.id
        }`
      );
    } catch (error) {
      console.error("Error adding reply:", error);
      addNotification("Gagal menambahkan balasan. Coba lagi.", "#", "error");
    }
  };

  const deductUserPoints = (userId, amount) => {
    setUserPointsMap((prev) => {
      const currentPoints = prev[userId] || 0;
      const newPoints = Math.max(0, currentPoints - amount);
      addNotification(
        `Poin untuk pengguna ID: ${userId} dikurangi ${amount}. Poin sekarang: ${newPoints}.`,
        `/admin/dashboard/users`,
        "points_deduction"
      );
      return { ...prev, [userId]: newPoints };
    });
  };

  const moderateComment = (
    articleId,
    commentId,
    newStatus,
    userId,
    pointsToDeduct = 10
  ) => {
    const updateStatusRecursive = (comments, targetId, status) =>
      comments.map((c) => ({
        ...c,
        status: c.id === targetId ? status : c.status,
        replies:
          c.replies?.length > 0
            ? updateStatusRecursive(c.replies, targetId, status)
            : [],
      }));

    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: updateStatusRecursive(prev[articleId], commentId, newStatus),
    }));

    if (newStatus === "rejected" && userId) {
      deductUserPoints(userId, pointsToDeduct);
    }
  };

  const deleteCommentContext = (
    articleId,
    commentId,
    userId,
    pointsToDeduct = 15
  ) => {
    const deleteRecursive = (comments, targetId) =>
      comments
        .filter((c) => c.id !== targetId)
        .map((c) => ({
          ...c,
          replies:
            c.replies?.length > 0 ? deleteRecursive(c.replies, targetId) : [],
        }));

    setArticleCommentsState((prev) => ({
      ...prev,
      [articleId]: deleteRecursive(prev[articleId] || [], commentId),
    }));

    if (userId) {
      deductUserPoints(userId, pointsToDeduct);
    }
    addNotification(
      `Komentar telah dihapus oleh admin.`,
      `/article/${articleId}`
    );
  };

  const broadcastAdminMessage = (title, messageBody) => {
    addNotification(
      `PENGUMUMAN: ${title} - ${messageBody}`,
      "/#",
      "admin_broadcast"
    );
  };

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

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
    (articleUrl) =>
      countCommentsRecursive(articleCommentsState[articleUrl] || []),
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
    loadInitialInteractions,
    loadComments,
    bookmarkedArticles,
    fetchBookmarkedArticles,
    // --- Admin Functions ---
    userPointsMap,
    moderateComment,
    deleteCommentContext,
    broadcastAdminMessage,
    deductUserPoints,
  };

  return (
    <ArticleInteractionContext.Provider value={value}>
      {children}
    </ArticleInteractionContext.Provider>
  );
};
