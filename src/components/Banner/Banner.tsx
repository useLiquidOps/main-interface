import React, { useState, useEffect } from "react";
import styles from "./Banner.module.css";
import { X } from "lucide-react";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const bannerState = localStorage.getItem("betaBanner");
    if (bannerState !== null) {
      setIsVisible(bannerState === "true");
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("betaBanner", "false");
  };

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <p>LiquidOps is currently in its beta phase, please use with caution and be aware of potential risks or limitations.</p>
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
