"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import styles from "./GoogleAnalytics.module.css";

interface GoogleAnalyticsProps {
  forceShow?: boolean;
}

export const GoogleAnalytics = ({
  forceShow = false,
}: GoogleAnalyticsProps) => {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check for saved consent first
    const savedConsent = localStorage.getItem("analytics-consent");
    if (savedConsent !== null && !forceShow) {
      setConsent(savedConsent === "true");
    } else if (forceShow) {
      // When forceShow is true, we reset the consent state to null to prompt the user again
      setConsent(null);
      startAnimation();
    }

    // Listen for the custom event from BetaDisclaimer (only if not forced to show)
    const handleBetaAccepted = () => {
      if (consent === null && !forceShow) {
        // Only show if user hasn't already made a choice
        startAnimation();
      }
    };

    // Also check if we should show analytics consent based on localStorage
    if (
      localStorage.getItem("showAnalyticsConsent") === "true" &&
      consent === null &&
      !forceShow
    ) {
      startAnimation();
      // Clear the flag once we've shown the consent
      localStorage.removeItem("showAnalyticsConsent");
    }

    // Add event listener for the custom event
    window.addEventListener("betaDisclaimerAccepted", handleBetaAccepted);

    // Cleanup
    return () => {
      window.removeEventListener("betaDisclaimerAccepted", handleBetaAccepted);
    };
  }, [consent, forceShow]);

  const startAnimation = () => {
    setIsAnimating(true);
    // Small delay to ensure CSS transition works properly
    setTimeout(() => {
      setShowConsent(true);
    }, 50);
  };

  const acceptCookies = () => {
    localStorage.setItem("analytics-consent", "true");
    setConsent(true);
    setShowConsent(false);
    setIsAnimating(false);
    localStorage.removeItem("showAnalyticsConsent");
    // If this was shown due to forceShow, we need to inform the parent component
    if (forceShow) {
      // Create a custom event to notify parent component that consent was given
      const event = new CustomEvent("analyticsConsentComplete");
      window.dispatchEvent(event);
    }
  };

  const declineCookies = () => {
    localStorage.setItem("analytics-consent", "false");
    setConsent(false);
    setShowConsent(false);
    setIsAnimating(false);
    localStorage.removeItem("showAnalyticsConsent");
    // If this was shown due to forceShow, we need to inform the parent component
    if (forceShow) {
      // Create a custom event to notify parent component that consent was given
      const event = new CustomEvent("analyticsConsentComplete");
      window.dispatchEvent(event);
    }
  };

  return (
    <>
      {consent === null && (isAnimating || showConsent) && (
        <div
          className={`${styles.consentBanner} ${showConsent ? styles.consentVisible : ""}`}
        >
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
