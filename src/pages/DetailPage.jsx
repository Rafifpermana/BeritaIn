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
  const [currentUserPoints, setCurrentUserPoints] = useState(75); // Contoh: Pengguna punya 75 poin
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

  const handleScrollToComments = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
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
    /* ... (tetap sama) ... */
  };

  if (loading) {
    /* ... (tetap sama) ... */
  }
  if (!articleStaticData) {
    /* ... (tampilan artikel tidak ditemukan tetap sama) ... */
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-8 sm:pt-6 sm:pb-10 md:pt-6 md:pb-12">
      <div className="container mx-auto px-4">
        <article className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl">
          {/* ... (Breadcrumbs, Judul Artikel, Meta, Gambar Utama, Konten HTML - tetap sama) ... */}

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
