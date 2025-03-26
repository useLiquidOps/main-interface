"use client";
import React, { useState, useEffect } from "react";
import styles from "./BetaDisclaimer.module.css";

const BetaDisclaimer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const disclaimerState = localStorage.getItem("betaDisclaimer");

    if (disclaimerState === null) {
      setIsVisible(true);
    } else {
      setIsVisible(disclaimerState === "true");
    }
  }, []);

  const onAccept = () => {
    setIsVisible(false);
    localStorage.setItem("betaDisclaimer", "false");

    localStorage.setItem("showAnalyticsConsent", "true");

    setTimeout(() => {
      const event = new CustomEvent("betaDisclaimerAccepted", {
        detail: { accepted: true },
      });
      window.dispatchEvent(event);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.disclaimer}>
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
