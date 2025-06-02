// src/utils/Portal.jsx
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

const ClientPortal = ({ children, selector }) => {
  // selector sekarang prop yang wajib
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mencoba mendapatkan elemen target portal
    ref.current = document.getElementById(selector);

    // Jika elemen target tidak ada, buat dan tambahkan ke body
    if (!ref.current) {
      const newPortalNode = document.createElement("div");
      newPortalNode.setAttribute("id", selector);
      document.body.appendChild(newPortalNode);
      ref.current = newPortalNode;
    }

    setMounted(true); // Tandai bahwa komponen sudah mounted di client-side

    // Opsional: Logika cleanup jika portal node dibuat secara dinamis dan ingin dihapus saat unmount.
    // Untuk kebanyakan kasus, membiarkan div portal persisten tidak masalah.
    // return () => {
    //   if (ref.current && ref.current.parentNode === document.body && ref.current.childNodes.length === 0 && ref.current.getAttribute('id') === selector) {
    //     // Hanya hapus jika itu adalah node yang kita buat dan kosong
    //     // Ini bisa lebih kompleks jika beberapa portal menggunakan selector yang sama
    //   }
    // };
  }, [selector]); // Jalankan efek ini jika selector berubah

  // Hanya render portal jika sudah mounted dan target node ada
  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

export default ClientPortal;
