"use client";
import styles from "./Footer.module.css";
import Image from "next/image";
import { useState } from "react";
import { GoogleAnalytics } from "../GoogleAnalytics/GoogleAnalytics";

const Footer = () => {
  // Use the environment variable set at build time from next.config.mjs
  const gitHash = process.env.NEXT_PUBLIC_GIT_HASH || "unknown";
  // State to control the analytics visibility
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Function to show the analytics banner
  const handleManageAnalytics = () => {
    // Remove the consent from localStorage
    localStorage.removeItem("analytics-consent");

    // If the component is already showing, hide it first to force a re-render
    if (showAnalytics) {
      setShowAnalytics(false);

      // Use setTimeout to ensure state updates before showing again
      setTimeout(() => {
        setShowAnalytics(true);
      }, 10);
    } else {
      setShowAnalytics(true);
    }
  };

  return (
    <>
      <div className={styles.footer}>
        <div className={styles.left}>
          <p
            className={styles.manageAnalytics}
            onClick={handleManageAnalytics}
            style={{ cursor: "pointer" }}
          >
            Manage analytics
          </p>
          <a
            href="https://forms.gle/nzErNbwpq1w4gPEt8"
            className={styles.feedback}
            target="_blank"
          >
            Send feedback
          </a>

          <div className={styles.version}>
            <p>v0.1.0</p>
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

      {/* Only show the GoogleAnalytics component when triggered */}
      {showAnalytics && <GoogleAnalytics />}
    </>
  );
};

export default Footer;
