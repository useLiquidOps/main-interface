"use client";
import React, { useState, useEffect } from "react";
import styles from "./BetaDisclaimer.module.css";

const BetaDisclaimer = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);

  useEffect(() => {
    const disclaimerState = localStorage.getItem("betaDisclaimer");

    if (disclaimerState === null) {
      // Start animation sequence
      setIsAnimating(true);
      // Small delay to ensure CSS transition works properly
      setTimeout(() => {
        setShowContent(true);
      }, 50);
      setIsVisible(true);
    } else {
      setIsVisible(disclaimerState === "true");
    }
  }, []);

  const onAccept = (): void => {
    setShowContent(false);
    // Add a delay before completely hiding the component to allow animation to complete
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 250); // Match the transition duration from CSS

    localStorage.setItem("betaDisclaimer", "false");
    localStorage.setItem("showAnalyticsConsent", "true");

    const event = new CustomEvent("betaDisclaimerAccepted", {
      detail: { accepted: true },
    });
    window.dispatchEvent(event);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={`${styles.disclaimer} ${showContent ? styles.disclaimerVisible : ""}`}
      >
        <p className={styles.title}>Mainnet beta disclaimer</p>

        <p className={styles.text}>
          LiquidOps is currently in its mainnet beta phase, this site uses
          mainnet AO ecosystem tokens.
        </p>

        <p className={styles.text}>
          Please use with caution and be aware of potential risks or
          limitations.
        </p>

        <button className={styles.button} onClick={onAccept}>
          <span>Accept</span>
        </button>
      </div>
    </div>
  );
};

export default BetaDisclaimer;
