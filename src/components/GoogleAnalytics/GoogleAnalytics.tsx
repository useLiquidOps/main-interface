"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import styles from "./GoogleAnalytics.module.css";

export const GoogleAnalytics = () => {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check for saved consent first
    const savedConsent = localStorage.getItem("analytics-consent");
    if (savedConsent !== null) {
      setConsent(savedConsent === "true");
    }

    // Listen for the custom event from BetaDisclaimer
    const handleBetaAccepted = () => {
      if (consent === null) {
        // Only show if user hasn't already made a choice
        setShowConsent(true);
      }
    };

    // Also check if we should show analytics consent based on localStorage
    if (
      localStorage.getItem("showAnalyticsConsent") === "true" &&
      consent === null
    ) {
      setShowConsent(true);
      // Clear the flag once we've shown the consent
      localStorage.removeItem("showAnalyticsConsent");
    }

    // Add event listener for the custom event
    window.addEventListener("betaDisclaimerAccepted", handleBetaAccepted);

    // Cleanup
    return () => {
      window.removeEventListener("betaDisclaimerAccepted", handleBetaAccepted);
    };
  }, [consent]);

  const acceptCookies = () => {
    localStorage.setItem("analytics-consent", "true");
    setConsent(true);
    setShowConsent(false);
    localStorage.removeItem("showAnalyticsConsent");
  };

  const declineCookies = () => {
    localStorage.setItem("analytics-consent", "false");
    setConsent(false);
    setShowConsent(false);
    localStorage.removeItem("showAnalyticsConsent");
  };

  return (
    <>
      {consent === null && showConsent && (
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
