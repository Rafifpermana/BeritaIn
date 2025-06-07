// src/pages/DetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticleInteractions } from "../hooks/useArticleInteractions";
import { useAuth } from "../contexts/AuthContext";
import { allArticlesData } from "../data/mockData";
import InteractionBar from "../components/InteractionBar";
import CommentSection from "../components/CommentSection";

const DetailPage = () => {
  const { articleId } = useParams();
  const { currentUser } = useAuth();
  const {
    articleInteractions,
    articleCommentsState,
    toggleLikeArticle,
    toggleDislikeArticle,
    toggleBookmark, // <-- Ambil fungsi bookmark dari context
    addCommentToArticle,
    addReplyToComment,
    toggleCommentLike,
    toggleCommentDislike,
    getCommentCountForArticleContext,
  } = useArticleInteractions();

  const [articleStaticData, setArticleStaticData] = useState(null);
  const [loading, setLoading] = useState(true);
  const commentSectionRef = useRef(null);

  const currentInteractions = articleInteractions?.[articleId] || {};
  const currentComments = articleCommentsState?.[articleId] || [];
  const totalCommentCount = getCommentCountForArticleContext(articleId);

  useEffect(() => {
    setLoading(true);
    const data = allArticlesData[articleId];
    setArticleStaticData(data);
    setLoading(false);
  }, [articleId]);

  const handleAddComment = (authorName, text) => {
    if (currentUser) {
      addCommentToArticle(articleId, authorName, text, currentUser);
    } else {
      alert("Anda harus login untuk dapat berkomentar.");
    }
  };

  const handleAddReply = (parentId, authorName, text) => {
    if (currentUser) {
      addReplyToComment(articleId, parentId, authorName, text, currentUser);
    } else {
      alert("Anda harus login untuk dapat membalas.");
    }
  };

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (loading) {
    return <div className="text-center py-12">Memuat artikel...</div>;
  }

  if (!articleStaticData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Oops! Artikel Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-8">
          Maaf, artikel yang Anda cari tidak ada atau telah dihapus.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-10">
      <div className="container mx-auto px-4">
        <article className="max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
            {articleStaticData.title}
          </h1>
          <div className="flex items-center text-xs text-gray-600 mb-6">
            <span>
              By{" "}
              <a href="#" className="font-semibold text-blue-700">
                {articleStaticData.author}
              </a>
            </span>
            <span className="mx-2">•</span>
            <span>
              {new Date(articleStaticData.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {articleStaticData.imageUrl && (
            <img
              src={articleStaticData.imageUrl}
              alt={articleStaticData.title}
              className="w-full h-auto object-cover rounded-lg mb-6 shadow-md"
            />
          )}

          <div
            className="prose prose-sm sm:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: articleStaticData.contentHTML }}
          />

          <div className="mt-10">
            {/* Pastikan semua props yang dibutuhkan InteractionBar terkirim */}
            <InteractionBar
              articleId={articleId}
              articleTitle={articleStaticData.title}
              articleUrl={window.location.href}
              likes={currentInteractions.likes}
              dislikes={currentInteractions.dislikes}
              userVote={currentInteractions.userVote}
              isBookmarked={currentInteractions.isBookmarked}
              onLikeToggle={() => toggleLikeArticle(articleId)}
              onDislikeToggle={() => toggleDislikeArticle(articleId)}
              onBookmarkToggle={() => toggleBookmark(articleId)}
              commentCount={totalCommentCount}
              onCommentClick={scrollToComments}
            />
          </div>

          <div ref={commentSectionRef} id="comment-section" className="mt-2">
            <CommentSection
              comments={currentComments}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              onToggleLikeComment={(commentId) =>
                toggleCommentLike(articleId, commentId)
              }
              onToggleDislikeComment={(commentId) =>
                toggleCommentDislike(articleId, commentId)
              }
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default DetailPage;
