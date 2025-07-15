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

    setMounted(true);
  }, [selector]);
  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

export default ClientPortal;
