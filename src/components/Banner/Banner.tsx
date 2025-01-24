import React, { useState, useEffect } from "react";
import styles from "./Banner.module.css";
import { X } from "lucide-react";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const bannerState = localStorage.getItem("bannerVisible");
    if (bannerState !== null) {
      setIsVisible(bannerState === "true");
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("bannerVisible", "false");
  };

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <p>All tokens are testnet, with no real-world value</p>
      <button
        onClick={handleClose}
        className={styles.closeButton}
        aria-label="Close banner"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Banner;
