// src/pages/DetailPage.jsx
import React, { useEffect, useState, useRef } from "react"; // useMemo tidak lagi dibutuhkan jika totalCommentCount dihitung langsung
import { useParams, Link } from "react-router-dom";
import { useArticleInteractions } from "../contexts/ArticleInteractionContext";
import { allArticlesData } from "../data/mockData";

import InteractionBar from "../components/InteractionBar";
import CommentSection from "../components/CommentSection";

const DetailPage = () => {
  const { articleId } = useParams();
  const {
    articleInteractions,
    articleCommentsState,
    toggleLikeArticle,
    toggleDislikeArticle,
    addCommentToArticle: contextAddCommentToArticle,
    addReplyToComment: contextAddReplyToComment,
    toggleLikeComment: contextToggleLikeCommentOnComment,
    toggleDislikeComment: contextToggleDislikeCommentOnComment,
    getCommentCountForArticleContext,
  } = useArticleInteractions();

  const [articleStaticData, setArticleStaticData] = useState(null);
  const [loading, setLoading] = useState(true);
  const commentSectionRef = useRef(null);

  // --- SIMULASI POIN PENGGUNA ---
  // Dalam aplikasi nyata, ini akan datang dari state global/konteks Auth atau API
  const [currentUserPoints, setCurrentUserPoints] = useState(55); // Contoh: Pengguna punya 75 poin
  // Anda bisa juga mencoba dengan nilai di bawah 50 untuk melihat efeknya, misal: useState(30);

  const currentArticleInteractions = articleInteractions[articleId] || {
    likes: 0,
    dislikes: 0,
    userVote: null,
    isBookmarked: false,
  };
  const currentArticleComments = articleCommentsState[articleId] || [];
  const totalCommentCountForDisplay =
    getCommentCountForArticleContext(articleId);

  useEffect(() => {
    setLoading(true);
    const staticData = allArticlesData[articleId];
    if (staticData) {
      setArticleStaticData(staticData);
      // Poin pengguna bisa di-fetch bersamaan dengan data user lain jika login
      // setCurrentUserPoints(fetchedUser.points);
    } else {
      console.warn(
        `Data statis artikel dengan ID "${articleId}" tidak ditemukan.`
      );
      setArticleStaticData(null);
    }
    setLoading(false);
  }, [articleId]);

  const handleAddCommentOnPage = (author, text) => {
    if (currentUserPoints < 50) {
      // Seharusnya ini sudah ditangani di CommentForm, tapi sebagai pengaman ganda
      alert("Poin Anda tidak cukup untuk berkomentar.");
      return;
    }
    contextAddCommentToArticle(articleId, author, text);
  };

  const handleAddReplyOnPage = (parentCommentId, replyAuthor, replyText) => {
    if (currentUserPoints < 50) {
      alert("Poin Anda tidak cukup untuk membalas komentar.");
      return;
    }
    contextAddReplyToComment(
      articleId,
      parentCommentId,
      replyAuthor,
      replyText
    );
  };

  const handleScrollToComments = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Memuat artikel...
      </div>
    );
  }

  if (!articleStaticData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Oops! Artikel Tidak Ditemukan
        </h1>
        <p className="text-gray-600 mb-8">
          Maaf, kami tidak dapat menemukan artikel yang Anda cari (ID:{" "}
          {articleId}). Mungkin artikel tersebut telah dipindahkan atau dihapus.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-8 sm:pt-6 sm:pb-10 md:pt-6 md:pb-12">
      <div className="container mx-auto px-4">
        <article className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl">
          <div className="flex flex-wrap items-baseline gap-x-1.5 mb-4 text-xs text-gray-500">
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors flex-shrink-0"
            >
              Beranda
            </Link>
            <span className="text-gray-400 flex-shrink-0">&gt;</span>

            <span className="text-gray-700 font-medium truncate min-w-0">
              {articleStaticData.title}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 leading-tight tracking-tight break-words">
            {articleStaticData.title}
          </h1>

          <div className="flex flex-wrap items-center text-xs text-gray-600 mb-6">
            <span>
              By{" "}
              <a
                href="#"
                className="font-semibold text-blue-700 hover:underline break-words"
              >
                {articleStaticData.author}
              </a>
            </span>
            <span className="text-gray-400 mx-1.5 sm:mx-2">•</span>
            <span>
              {new Date(articleStaticData.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {articleStaticData.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-md">
              <img
                src={articleStaticData.imageUrl}
                alt={articleStaticData.title}
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
          )}

          <div
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 leading-relaxed selection:bg-blue-200 selection:text-blue-900 break-words"
            dangerouslySetInnerHTML={{ __html: articleStaticData.contentHTML }}
          />

          <div className="mt-10 sm:mt-12">
            <InteractionBar
              articleTitle={articleStaticData.title}
              articleUrl={window.location.href}
              likes={currentArticleInteractions.likes}
              dislikes={currentArticleInteractions.dislikes}
              userVote={currentArticleInteractions.userVote}
              isBookmarked={currentArticleInteractions.isBookmarked}
              onLikeToggle={() => toggleLikeArticle(articleId)}
              onDislikeToggle={() => toggleDislikeArticle(articleId)}
              commentCount={totalCommentCountForDisplay}
              onCommentClick={handleScrollToComments}
            />
          </div>
          <div
            ref={commentSectionRef}
            id="comment-section"
            className="mt-1 sm:mt-2"
          >
            <CommentSection
              articleId={articleId}
              comments={currentArticleComments}
              onAddComment={handleAddCommentOnPage}
              onAddReply={handleAddReplyOnPage}
              onToggleLikeComment={(commentId) =>
                contextToggleLikeCommentOnComment(articleId, commentId)
              }
              onToggleDislikeComment={(commentId) =>
                contextToggleDislikeCommentOnComment(articleId, commentId)
              }
              currentUserPoints={currentUserPoints} // <-- TERUSKAN POIN PENGGUNA
            />
          </div>
        </article>
      </div>
    </div>
  );
};
export default DetailPage;
