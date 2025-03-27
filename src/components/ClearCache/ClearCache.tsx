import React from "react";
import styles from "./ClearCache.module.css";

const ClearCache = () => {
  const dataToNotClear = ["analytics-consent", "betaDisclaimer", "site_hints"];

  const handleClearCache = () => {
    // Save the items we want to keep
    const savedItems: Record<string, string> = {};
    dataToNotClear.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        savedItems[key] = value;
      }
    });

    // Clear everything in localStorage
    localStorage.clear();

    // Restore the items we want to keep
    Object.entries(savedItems).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // // Refresh the page
    window.location.reload();
  };

  return (
    <button className={styles.button} onClick={handleClearCache}>
      Refresh site
    </button>
  );
};

export default ClearCache;
