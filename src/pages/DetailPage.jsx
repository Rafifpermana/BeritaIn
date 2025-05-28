import React, { useEffect, useState, useRef } from "react"; // Menambahkan useRef
import { useParams, Link } from "react-router-dom";

import InteractionBar from "../components/InteractionBar";
import CommentSection from "../components/CommentSection";

// Data Artikel Contoh (sama seperti sebelumnya)
const allArticlesData = {
  "main-travel-story": {
    id: "main-travel-story",
    title: "Mind-Blowing Travel Destinations You Need to Visit!",
    author: "Muhammad Rafif Permana Putra",
    date: "Jan 23, 2025",
    imageUrl: "/placeholder-laptop.jpg",
    initialLikes: 120,
    initialDislikes: 5,
    contentHTML: "<p>Detail perjalanan yang menakjubkan...</p>",
  },
  "ai-poetry": {
    id: "ai-poetry",
    title: "AI Breakthrough: Machines Now Write Poetry?",
    author: "Alex Johnson",
    date: "Jan 13, 2025",
    imageUrl: "/placeholder-ai.jpg",
    initialLikes: 95,
    initialDislikes: 2,
    contentHTML: "<p>Penemuan terbaru dalam kecerdasan buatan...</p>",
  },
  "trump-panama": {
    id: "trump-panama",
    title:
      "Trump reiterates threat to retake Panama Canal ‘or something very powerful’ will happen if pressures on U.S. increase",
    author: "John Doe",
    date: "Jan 13, 2025",
    imageUrl: "/placeholder-trump-large.jpg",
    initialLikes: 250,
    initialDislikes: 30,
    contentHTML: "<p>Konten artikel mengenai pernyataan Trump...</p>",
  },
  "ai-gaming-change": {
    id: "ai-gaming-change",
    title: "How AI is Changing the Way We Game",
    author: "John Doe",
    date: "Jan 13, 2025",
    imageUrl: "/placeholder-ai-game-large.jpg",
    initialLikes: 180,
    initialDislikes: 8,
    contentHTML:
      "<p>Bagaimana Kecerdasan Buatan merevolusi industri game...</p>",
  },
  "sa-land": {
    id: "sa-land",
    title:
      "South Africa denies ‘confiscating land,’ after Trump threatens to cut off aid",
    author: "Jason Mitchell",
    date: "Jan 13, 2025",
    imageUrl: "/placeholder-sa.jpg",
    initialLikes: 70,
    initialDislikes: 15,
    contentHTML: "<p>Detail mengenai situasi di Afrika Selatan...</p>",
  },
};

const initialCommentsData = {
  "main-travel-story": [
    {
      id: 1,
      author: "Traveler123",
      text: "Tempatnya keren banget!",
      timestamp: Date.now() - 200000,
      avatarUrl: "/placeholder-avatar-1.jpg",
    },
  ],
  "ai-poetry": [
    {
      id: 1,
      author: "PenyairAI",
      text: "Wow, AI bisa sekreatif ini?",
      timestamp: Date.now() - 150000,
      avatarUrl: "/placeholder-avatar-2.jpg",
    },
    {
      id: 2,
      author: "TechEnthusiast",
      text: "Luar biasa perkembangannya!",
      timestamp: Date.now() - 100000,
      avatarUrl: "/placeholder-avatar-3.jpg",
    },
  ],
  "trump-panama": [
    {
      id: 1,
      author: "PolitikusHandal",
      text: "Ini pernyataan yang serius!",
      timestamp: Date.now() - 300000,
      avatarUrl: "/placeholder-avatar-1.jpg",
    },
  ],
};

const DetailPage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // State komentar sekarang di DetailPage
  const [comments, setComments] = useState([]);

  const commentSectionRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const foundArticle = allArticlesData[articleId];

    if (foundArticle) {
      setArticle(foundArticle);
      // Inisialisasi komentar dari data awal saat artikel berubah
      setComments(initialCommentsData[articleId] || []);
    } else {
      console.error("Artikel tidak ditemukan untuk ID:", articleId);
    }
    setLoading(false);
  }, [articleId]);

  // Fungsi untuk menambah komentar, sekarang ada di DetailPage
  const handleAddComment = (author, text) => {
    const newCommentEntry = {
      id: Date.now(),
      author,
      text,
      timestamp: Date.now(),
      avatarUrl: "/placeholder-avatar.png", // Avatar default untuk komentar baru
    };
    setComments((prevComments) => [newCommentEntry, ...prevComments]);
    // TODO: Kirim komentar baru ke backend di sini
    console.log(
      `Komentar baru untuk artikel ${articleId} (dari DetailPage):`,
      newCommentEntry
    );
  };

  const handleScrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Memuat artikel...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-6">
          Maaf, artikel yang Anda cari tidak dapat ditemukan.
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <article className="max-w-3xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">
        <div className="mb-6 text-xs sm:text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600">
            Beranda
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700 font-medium">
            {article.title.substring(0, 50)}...
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8">
          <span>
            By{" "}
            <a href="#" className="font-semibold text-blue-600 hover:underline">
              {article.author}
            </a>
          </span>
          <span className="text-gray-400 mx-2">•</span>
          <span>{article.date}</span>
        </div>

        {article.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto object-cover aspect-video"
            />
          </div>
        )}

        <div
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 leading-relaxed selection:bg-blue-100"
          dangerouslySetInnerHTML={{ __html: article.contentHTML }}
        />

        <div className="mt-10">
          <InteractionBar
            articleTitle={article.title}
            articleUrl={window.location.href}
            initialLikes={article.initialLikes}
            initialDislikes={article.initialDislikes}
            commentCount={comments.length} // Teruskan jumlah komentar ke InteractionBar
            onCommentClick={handleScrollToComments}
          />
        </div>
        <div ref={commentSectionRef}>
          <CommentSection
            articleId={articleId}
            comments={comments} // Teruskan array comments
            onAddComment={handleAddComment} // Teruskan fungsi untuk menambah komentar
          />
        </div>
      </article>
    </div>
  );
};

export default DetailPage;
