"use client";
import styles from "./Footer.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { GoogleAnalytics } from "../GoogleAnalytics/GoogleAnalytics";
import packageInfo from "../../../package.json";

const Footer = () => {
  // Use the environment variable set at build time from next.config.mjs
  const gitHash = process.env.NEXT_PUBLIC_GIT_HASH || "unknown";
  // get UI version from package.json
  const version = packageInfo.version;
  // State to control the analytics visibility
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Function to show the analytics banner
  const handleManageAnalytics = () => {
    // Toggle the analytics visibility state
    setShowAnalytics(true);
  };

  // Listen for the completion event for analytics
  useEffect(() => {
    const handleConsentComplete = () => {
      setShowAnalytics(false);
    };

    window.addEventListener("analyticsConsentComplete", handleConsentComplete);

    // Cleanup
    return () => {
      window.removeEventListener(
        "analyticsConsentComplete",
        handleConsentComplete,
      );
    };
  }, []);

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.left}>
          <a
            href="https://discord.gg/GMzWYZA9KJ"
            className={styles.support}
            target="_blank"
          >
            Support
          </a>
          <a
            href="https://forms.gle/nzErNbwpq1w4gPEt8"
            className={styles.feedback}
            target="_blank"
          >
            Feedback
          </a>
          <p
            className={styles.manageAnalytics}
            onClick={handleManageAnalytics}
            style={{ cursor: "pointer" }}
          >
            Analytics
          </p>

          <div className={styles.version}>
            <p>v{version}</p>
            <a
              href={`https://github.com/useLiquidOps/main-interface/commit/${gitHash}`}
              target="_blank"
            >
              {gitHash}
            </a>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.socials}>
            <a
              href="https://defillama.com/protocol/liquidops"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/socials/DefiLlama.svg"
                alt="X"
                height={15}
                width={15}
              />
            </a>
            <a
              href="https://x.com/Liquid_Ops"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/socials/x.svg" alt="X" height={15} width={15} />
            </a>
            <a
              href="https://discord.gg/Jad4v8ykgY"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/socials/discord.svg"
                alt="Discord"
                height={15}
                width={15}
              />
            </a>
            <a
              href="https://github.com/useLiquidOps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/socials/github.svg"
                alt="GitHub"
                height={15}
                width={15}
              />
            </a>
          </div>
        </div>
      </div>

      <GoogleAnalytics forceShow={showAnalytics} />
    </>
  );
};

export default Footer;
