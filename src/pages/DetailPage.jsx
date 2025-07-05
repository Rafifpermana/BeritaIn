// src/pages/DetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { useArticleInteractions } from "../hooks/useArticleInteractions";
import { useAuth } from "../contexts/AuthContext";
import InteractionBar from "../components/InteractionBar";
import CommentSection from "../components/CommentSection";

// --- Tentukan URL dasar untuk backend API Anda ---
const API_BASE_URL = "http://localhost:8000";

const DetailPage = () => {
  const { articleId } = useParams(); // Ini adalah slug, bukan URL asli
  const location = useLocation();
  const { currentUser } = useAuth();

  // State untuk menyimpan data artikel yang diambil dari API
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const commentSectionRef = useRef(null);

  // Hooks untuk interaksi (like, comment, dll.) - tidak berubah
  const {
    articleInteractions,
    articleCommentsState,
    toggleLikeArticle,
    toggleDislikeArticle,
    toggleBookmark,
    addCommentToArticle,
    addReplyToComment,
    toggleCommentLike,
    toggleCommentDislike,
    getCommentCountForArticleContext,
    loadInitialInteractions,
    loadComments,
  } = useArticleInteractions();

  // URL asli artikel, yang akan digunakan sebagai ID unik
  const articleUrl = location.state?.articleUrl;

  const currentInteractions = articleInteractions?.[articleUrl] || {};
  const currentComments = articleCommentsState?.[articleUrl] || [];
  const totalCommentCount = getCommentCountForArticleContext(articleUrl);

  // GANTI DENGAN BLOK INI
  useEffect(() => {
    // Pastikan articleUrl ada sebelum fetching
    if (!articleUrl) {
      setError("URL artikel tidak valid atau tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Ambil konten utama artikel
        const response = await axios.post(
          `${API_BASE_URL}/api/fetch`,
          { url: articleUrl },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 30000,
          }
        );

        if (response.data && response.data.success && response.data.data) {
          setArticleData(response.data.data);
        } else {
          throw new Error(
            response.data?.message || "Gagal mengekstrak konten artikel."
          );
        }

        // 2. Ambil data interaksi dan komentar secara paralel
        // (Memanggil fungsi dari context yang sudah kita buat sebelumnya)
        await Promise.all([
          loadInitialInteractions(articleUrl),
          loadComments(articleUrl),
        ]);
      } catch (err) {
        console.error("Gagal memuat data halaman detail:", err);
        setError(
          err.message ||
            "Tidak dapat memuat konten artikel. Mungkin artikel sudah tidak tersedia atau ada masalah jaringan."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Pastikan Anda memasukkan semua fungsi dari context di dalam dependency array
  }, [articleUrl, loadInitialInteractions, loadComments]);

  const handleAddComment = (authorName, text) => {
    if (currentUser) {
      addCommentToArticle(articleData, text);
    } else {
      alert("Anda harus login untuk dapat berkomentar.");
    }
  };

  const handleAddReply = (parentId, authorName, text) => {
    if (currentUser) {
      addReplyToComment(articleData, parentId, text);
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
    return <div className="text-center py-12 font-bold">Memuat artikel...</div>;
  }

  if (error || !articleData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Oops! Gagal Memuat Artikel
        </h1>
        <p className="text-gray-600 mb-8">
          {error ||
            "Maaf, artikel yang Anda cari tidak ada atau telah dihapus."}
        </p>

        {/* === PERBAIKAN: Menambahkan link ke sumber asli sebagai alternatif === */}
        {articleUrl && (
          <p className="mb-8">
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              Tidak bisa memuat konten? Coba buka sumber aslinya.
            </a>
          </p>
        )}

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
            {articleData.title}
          </h1>
          <div className="flex items-center text-xs text-gray-600 mb-6">
            <span>
              By{" "}
              <span className="font-semibold text-blue-700">
                {/* PERBAIKAN: Sesuaikan dengan struktur response backend */}
                By Tim Redaksi
              </span>
            </span>
            <span className="mx-2">•</span>
            <span>
              {/* PERBAIKAN: Gunakan word_count jika tersedia */}
              {articleData.word_count
                ? `${articleData.word_count} kata`
                : "Artikel"}
            </span>
          </div>

          {/* Tampilkan gambar jika tersedia */}
          {articleData.image && (
            <img
              src={articleData.image}
              alt={articleData.title}
              className="w-full h-auto object-cover rounded-lg mb-6 shadow-md"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          {/* Tampilkan excerpt jika tersedia */}

          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none leading-relaxed">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: articleData.content }}
              style={{
                lineHeight: "1.8",
                fontSize: "16px",
                color: "#374151",
                textAlign: "justify",
              }}
            />
          </div>

          <style>{`
            .article-content p {
              margin-bottom: 1.5em;
              text-indent: 2em;
              line-height: 1.8;
              text-align: justify;
            }

            .article-content p:first-child {
              text-indent: 0;
            }

            .article-content h1,
            .article-content h2,
            .article-content h3,
            .article-content h4,
            .article-content h5,
            .article-content h6 {
              margin-top: 2em;
              margin-bottom: 1em;
              font-weight: 600;
              color: #1f2937;
            }

            .article-content blockquote {
              border-left: 4px solid #3b82f6;
              background-color: #f8fafc;
              padding: 1em 1.5em;
              margin: 1.5em 0;
              font-style: italic;
            }

            .article-content ul,
            .article-content ol {
              margin: 1.5em 0;
              padding-left: 2em;
            }

            .article-content li {
              margin-bottom: 0.5em;
              line-height: 1.6;
            }

            .article-content strong {
              font-weight: 600;
              color: #1f2937;
            }

            .article-content a {
              color: #3b82f6;
              text-decoration: underline;
            }

            .article-content a:hover {
              color: #1d4ed8;
            }

            .article-content img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 1.5em auto;
              display: block;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }

            .article-content pre {
              background-color: #f1f5f9;
              padding: 1em;
              border-radius: 6px;
              overflow-x: auto;
              margin: 1.5em 0;
            }

            .article-content code {
              background-color: #f1f5f9;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-size: 0.9em;
            }
          `}</style>

          <div className="mt-10">
            <InteractionBar
              articleId={articleUrl} // Gunakan URL sebagai ID unik
              articleTitle={articleData.title}
              articleUrl={articleUrl}
              likes={currentInteractions.likes}
              dislikes={currentInteractions.dislikes}
              userVote={currentInteractions.userVote}
              isBookmarked={currentInteractions.isBookmarked}
              onLikeToggle={() => toggleLikeArticle(articleData)}
              onDislikeToggle={() => toggleDislikeArticle(articleData)}
              onBookmarkToggle={() => toggleBookmark(articleData)}
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
                toggleCommentLike(articleUrl, commentId)
              }
              onToggleDislikeComment={(commentId) =>
                toggleCommentDislike(articleUrl, commentId)
              }
            />
          </div>
        </article>
      </div>
    </div>
  );
};

export default DetailPage;
