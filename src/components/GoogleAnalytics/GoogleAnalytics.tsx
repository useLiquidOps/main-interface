"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import styles from "./GoogleAnalytics.module.css";

export const GoogleAnalytics = () => {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for saved consent
    const savedConsent = localStorage.getItem("analytics-consent");
    if (savedConsent !== null) {
      setConsent(savedConsent === "true");
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

  return (
    <>
      {consent === null && (
        <div className={styles.consentBanner}>
          <h4 className={styles.consentTitle}>We value your privacy</h4>
          <p className={styles.consentText}>
            By clicking "Accept", you consent to our analytics to help improve
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
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-GPLFG9BM1B"
          />
          <Script id="google-analytics" strategy="afterInteractive">
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
