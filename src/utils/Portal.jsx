// src/components/Portal.jsx (Versi Sederhana)
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ClientPortal = ({ children, selector = "portal-root" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Opsional: membuat div jika tidak ada
    let portalContainer = document.getElementById(selector);
    if (!portalContainer) {
      portalContainer = document.createElement("div");
      portalContainer.setAttribute("id", selector);
      document.body.appendChild(portalContainer);
    }
    return () => setMounted(false); // Tidak menghapus container agar bisa dipakai ulang
  }, [selector]);

  return mounted
    ? createPortal(children, document.getElementById(selector) || document.body)
    : null;
};

export default ClientPortal;
