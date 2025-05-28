import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import InteractionBar from "../components/InteractionBar";
import CommentSection from "../components/CommentSection";
// Impor data dari file terpusat
import {
  allArticlesData,
  initialCommentsData,
  calculateTotalComments,
} from "../data/mockData";

const DetailPage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const commentSectionRef = useRef(null);

  // calculateTotalComments sudah diimpor dari mockData.js
  const totalCommentCount = useMemo(
    () => calculateTotalComments(comments),
    [comments]
  );

  useEffect(() => {
    setLoading(true);
    const foundArticle = allArticlesData[articleId];

    if (foundArticle) {
      setArticle(foundArticle);
      setComments(initialCommentsData[articleId] || []);
    } else {
      setArticle(null);
      setComments([]);
      console.warn(
        `Artikel dengan ID "${articleId}" tidak ditemukan di allArticlesData.`
      );
    }
    setLoading(false);
  }, [articleId]);

  const handleAddComment = (author, text) => {
    const newCommentEntry = {
      id: Date.now(),
      author: author.trim() === "" ? "Pengguna Anonim" : author,
      text,
      timestamp: Date.now(),
      avatarUrl: "/placeholder-avatar.png",
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    setComments((prevComments) => [newCommentEntry, ...prevComments]);
    // TODO: Kirim data ke backend
  };

  const handleAddReply = (parentCommentId, replyAuthor, replyText) => {
    const newReply = {
      id: Date.now(),
      parentId: parentCommentId,
      author: replyAuthor.trim() === "" ? "Pengguna Anonim" : replyAuthor,
      text: replyText,
      timestamp: Date.now(),
      avatarUrl: "/placeholder-avatar.png",
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    const addReplyToCommentList = (list, targetParentId, replyToAdd) => {
      return list.map((comment) => {
        if (comment.id === targetParentId) {
          return {
            ...comment,
            replies: [replyToAdd, ...(comment.replies || [])],
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          const updatedReplies = addReplyToCommentList(
            comment.replies,
            targetParentId,
            replyToAdd
          );
          if (updatedReplies !== comment.replies) {
            return { ...comment, replies: updatedReplies };
          }
        }
        return comment;
      });
    };
    setComments((prevComments) =>
      addReplyToCommentList(prevComments, parentCommentId, newReply)
    );
    // TODO: Kirim data ke backend
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

  if (!article) {
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
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl">
          <div className="flex flex-wrap items-baseline gap-x-1.5 mb-6 text-xs sm:text-sm text-gray-500">
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors flex-shrink-0"
            >
              Beranda
            </Link>
            <span className="text-gray-400 flex-shrink-0">&gt;</span>
            <span className="text-gray-700 font-medium truncate min-w-0">
              {article.title}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight break-words">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mb-8">
            <span>
              By{" "}
              <a
                href="#"
                className="font-semibold text-blue-700 hover:underline break-words"
              >
                {article.author}
              </a>
            </span>
            <span className="text-gray-400 mx-2">•</span>
            <span>
              {new Date(article.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {article.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover aspect-[16/9]"
              />
            </div>
          )}
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 leading-relaxed selection:bg-blue-200 selection:text-blue-900 break-words"
            dangerouslySetInnerHTML={{ __html: article.contentHTML }}
          />

          <div className="mt-12">
            <InteractionBar
              articleTitle={article.title}
              articleUrl={window.location.href}
              initialLikes={article.initialLikes || 0}
              initialDislikes={article.initialDislikes || 0}
              commentCount={totalCommentCount}
              onCommentClick={handleScrollToComments}
            />
          </div>
          <div ref={commentSectionRef} id="comment-section" className="mt-2">
            <CommentSection
              articleId={articleId}
              comments={comments}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default DetailPage;
