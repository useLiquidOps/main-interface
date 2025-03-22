"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import styles from "./GoogleAnalytics.module.css";

export const GoogleAnalytics = () => {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Check for saved consent
    const savedConsent = localStorage.getItem("analytics-consent");
    if (savedConsent !== null) {
      setConsent(savedConsent === "true");
    }

    // Stop Google analytics tab loading before page is loaded
    // Function to handle when content is loaded
    const handleContentLoaded = () => {
      setContentLoaded(true);
    };

    // If document is already complete, set contentLoaded immediately
    if (document.readyState === "complete") {
      setContentLoaded(true);
    } else {
      // Otherwise wait for the load event
      window.addEventListener("load", handleContentLoaded);

      // Cleanup
      return () => {
        window.removeEventListener("load", handleContentLoaded);
      };
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("analytics-consent", "true");
    setConsent(true);
  };

  const declineCookies = () => {
    localStorage.setItem("analytics-consent", "false");
    setConsent(false);
  };

  // Don't render anything until main content has loaded
  if (!contentLoaded) return null;

  return (
    <>
      {consent === null && (
        <div className={styles.consentBanner}>
          <h4 className={styles.consentTitle}>We value your privacy</h4>
          <p className={styles.consentText}>
            By clicking "Accept", you consent to our analytics and help improve
            LiquidOps.
          </p>
          <div className={styles.consentButtons}>
            <button
              onClick={acceptCookies}
              className={`${styles.consentButton} ${styles.acceptButton}`}
            >
              Accept
            </button>
            <button
              onClick={declineCookies}
              className={`${styles.consentButton} ${styles.declineButton}`}
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {consent === true && (
        <>
          <Script
            strategy="lazyOnload"
            src="https://www.googletagmanager.com/gtag/js?id=G-GPLFG9BM1B"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GPLFG9BM1B');
            `}
          </Script>
        </>
      )}
    </>
  );
};
