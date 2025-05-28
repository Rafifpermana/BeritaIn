import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import InteractionBar from "../components/InteractionBar";
import CommentSection from "../components/CommentSection";

// DATA ARTIKEL CONTOH (Sama seperti sebelumnya)
// Pastikan setiap artikel memiliki 'id', 'initialLikes', 'initialDislikes'
// Dan initialCommentsData memiliki entri untuk setiap ID artikel dengan struktur komentar yang benar
// (termasuk 'likes' dan 'replies' untuk setiap komentar/balasan)

const allArticlesData = {
  "main-travel-story": {
    id: "main-travel-story",
    title: "Mind-Blowing Travel Destinations You Need to Visit!",
    author: "Muhammad Rafif Permana Putra",
    date: "Jan 23, 2025",
    imageUrl: "/placeholder-laptop.jpg",
    initialLikes: 120,
    initialDislikes: 5,
    contentHTML:
      "<p>Detail perjalanan yang menakjubkan, penuh dengan pemandangan indah dan pengalaman tak terlupakan. Dari pegunungan yang menjulang tinggi hingga pantai berpasir putih, dunia ini menawarkan begitu banyak keajaiban untuk dijelajahi.</p><p>Artikel ini akan membawa Anda melalui beberapa destinasi paling menakjubkan yang wajib masuk dalam daftar perjalanan Anda berikutnya. Siapkan diri Anda untuk terinspirasi!</p>",
  },
  "ai-poetry": {
    id: "ai-poetry",
    title: "AI Breakthrough: Machines Now Write Poetry?",
    author: "Alex Johnson",
    date: "Jan 13, 2025",
    imageUrl: "/placeholder-ai.jpg",
    initialLikes: 95,
    initialDislikes: 2,
    contentHTML:
      "<p>Sebuah terobosan baru dalam kecerdasan buatan telah menggemparkan dunia sastra. Mesin yang ditenagai oleh algoritma canggih kini dilaporkan mampu menghasilkan puisi dengan kedalaman emosi dan kompleksitas linguistik yang menyaingi karya manusia.</p><p>Apakah ini pertanda era baru kolaborasi manusia-mesin dalam seni, ataukah ancaman bagi kreativitas otentik? Mari kita selami lebih dalam.</p>",
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
    contentHTML:
      "<p>Dalam sebuah pernyataan yang mengejutkan, mantan Presiden Trump kembali mengemukakan ancaman terkait Terusan Panama. Pernyataan ini memicu berbagai reaksi di panggung politik global dan menimbulkan pertanyaan mengenai implikasi di masa depan.</p><p>Analisis mendalam mengenai konteks sejarah dan potensi dampak dari pernyataan ini menjadi krusial untuk dipahami.</p>",
  },
  "ai-gaming-change": {
    id: "ai-gaming-change",
    title: "How AI is Changing the Way We Game",
    author: "Jane Doe", // Nama Author berbeda untuk variasi
    date: "Jan 14, 2025", // Tanggal berbeda
    imageUrl: "/placeholder-ai-game-large.jpg",
    initialLikes: 180,
    initialDislikes: 8,
    contentHTML:
      "<p>Kecerdasan Buatan (AI) bukan lagi sekadar konsep futuristik dalam industri game; ia telah menjadi kekuatan transformatif yang nyata. Dari NPC (Non-Player Character) yang berperilaku lebih realistis hingga pembuatan level game secara prosedural, AI membuka berbagai kemungkinan baru.</p><p>Artikel ini menjelajahi bagaimana AI secara fundamental mengubah cara kita berinteraksi dan menikmati video game.</p>",
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
    contentHTML:
      "<p>Pemerintah Afrika Selatan membantah tuduhan mengenai perampasan lahan menyusul pernyataan kontroversial dari mantan Presiden AS. Isu ini menyoroti kompleksitas reformasi agraria dan dinamika hubungan internasional.</p><p>Laporan ini memberikan pandangan mendalam mengenai situasi terkini dan berbagai perspektif yang terlibat.</p>",
  },
  // Tambahkan artikel lain sesuai ID yang digunakan di HomePage
};

const initialCommentsData = {
  "main-travel-story": [
    {
      id: 1,
      author: "Traveler123",
      text: "Tempatnya keren banget! Pengen ke sana suatu hari nanti.",
      timestamp: Date.now() - 2000000,
      avatarUrl: "/placeholder-avatar-1.jpg",
      likes: 15,
      replies: [],
    },
    {
      id: 2,
      author: "BackpackerJoe",
      text: "Ada tips budgeting buat ke sana gak?",
      timestamp: Date.now() - 1000000,
      avatarUrl: "/placeholder-avatar-2.jpg",
      likes: 8,
      replies: [
        {
          id: 201,
          parentId: 2,
          author: "Traveler123",
          text: "Coba cari tiket promo dan nginap di hostel, lumayan hemat!",
          timestamp: Date.now() - 800000,
          avatarUrl: "/placeholder-avatar-1.jpg",
          likes: 3,
          replies: [],
        },
      ],
    },
  ],
  "ai-poetry": [
    {
      id: 10,
      author: "PenyairAI",
      text: "Wow, AI bisa sekreatif ini? Sebagai penyair, saya merasa tertantang sekaligus terinspirasi.",
      timestamp: Date.now() - 1500000,
      avatarUrl: "/placeholder-avatar-2.jpg",
      likes: 22,
      replies: [
        {
          id: 101,
          parentId: 10,
          author: "TechEnthusiast",
          text: "Setuju, ini kemajuan besar! Mungkin nanti ada kolaborasi penyair dan AI.",
          timestamp: Date.now() - 1200000,
          avatarUrl: "/placeholder-avatar-3.jpg",
          likes: 7,
          replies: [],
        },
      ],
    },
    {
      id: 20,
      author: "KritikusSastra",
      text: "Apakah ini benar-benar 'kreativitas' atau hanya simulasi pola yang canggih? Pertanyaan menarik.",
      timestamp: Date.now() - 1000000,
      avatarUrl: "/placeholder-avatar-4.jpg",
      likes: 12,
      replies: [],
    },
  ],
  "trump-panama": [
    {
      id: 30,
      author: "PolitikusHandal",
      text: "Ini pernyataan yang serius dan perlu ditanggapi dengan hati-hati oleh semua pihak.",
      timestamp: Date.now() - 3000000,
      avatarUrl: "/placeholder-avatar-1.jpg",
      likes: 35,
      replies: [],
    },
  ],
  // Pastikan ada entri kosong atau data untuk semua ID artikel
  "ai-gaming-change": [],
  "sa-land": [],
};

const DetailPage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const commentSectionRef = useRef(null);

  const calculateTotalComments = (commentsList) => {
    let count = 0;
    const countRecursively = (list) => {
      if (!list) return;
      for (const item of list) {
        count++;
        if (item.replies && item.replies.length > 0) {
          countRecursively(item.replies);
        }
      }
    };
    countRecursively(commentsList);
    return count;
  };

  const totalCommentCount = useMemo(
    () => calculateTotalComments(comments),
    [comments]
  );

  useEffect(() => {
    setLoading(true);
    // console.log("Mencoba memuat artikel untuk ID:", articleId);
    const foundArticle = allArticlesData[articleId];

    if (foundArticle) {
      // console.log("Artikel ditemukan:", foundArticle);
      setArticle(foundArticle);
      setComments(initialCommentsData[articleId] || []);
    } else {
      console.warn("Artikel TIDAK ditemukan untuk ID:", articleId);
      setArticle(null); // Eksplisit set artikel jadi null jika tidak ditemukan
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
      replies: [],
    };
    setComments((prevComments) => [newCommentEntry, ...prevComments]);
    // TODO: Kirim komentar baru ke backend di sini
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
          return {
            ...comment,
            replies: addReplyToCommentList(
              comment.replies,
              targetParentId,
              replyToAdd
            ),
          };
        }
        return comment;
      });
    };
    setComments((prevComments) =>
      addReplyToCommentList(prevComments, parentCommentId, newReply)
    );
    // TODO: Kirim balasan ke backend
  };

  const handleScrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
      {" "}
      {/* Latar belakang halaman */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-2xl">
          {" "}
          {/* Shadow lebih kuat, rounded lebih besar */}
          <div className="mb-6 text-xs sm:text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            {/* TODO: Tambahkan Kategori jika ada */}
            <span className="text-gray-700 font-medium truncate w-64 inline-block_">
              {article.title}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8">
            <span>
              By{" "}
              <a
                href="#"
                className="font-semibold text-blue-700 hover:underline"
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
            {/* TODO: Tambahkan waktu baca jika ada */}
          </div>
          {article.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              {" "}
              {/* Rounded lebih kecil untuk gambar, shadow halus */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover aspect-[16/9]" // Rasio aspek 16:9 umum
              />
            </div>
          )}
          {/* Untuk styling konten HTML dari CMS/Markdown, plugin @tailwindcss/typography sangat membantu */}
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 leading-relaxed selection:bg-blue-200 selection:text-blue-900"
            dangerouslySetInnerHTML={{ __html: article.contentHTML }}
          />
          <div className="mt-12">
            {" "}
            {/* Margin atas sebelum interaction bar */}
            <InteractionBar
              articleTitle={article.title}
              articleUrl={window.location.href} // URL saat ini untuk fungsi share
              initialLikes={article.initialLikes || 0}
              initialDislikes={article.initialDislikes || 0}
              commentCount={totalCommentCount}
              onCommentClick={handleScrollToComments}
            />
          </div>
          <div ref={commentSectionRef} className="mt-2">
            {" "}
            {/* Sedikit margin atas untuk comment section */}
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
