"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./AssetDisplay.module.css";
import Image from "next/image";
import { useModal } from "../PopUp/PopUp";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import AssetRow from "@/components/AssetRow/AssetRow";

interface AssetDisplayProps {
  mode: "lend" | "borrow";
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ mode }) => {
  const [showAll, setShowAll] = useState(false);
  const [animateOnScroll, setAnimateOnScroll] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { openModal } = useModal();
  const { data: supportedTokens = [] } = useSupportedTokens();
  const componentRef = useRef<HTMLDivElement>(null);
  const animationShownRef = useRef(false);

  // Delay showing content to avoid empty state flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check localStorage to see if hint has been shown before
    try {
      const hintShown = localStorage.getItem("site_hints");
      if (hintShown === "true") {
        // Already shown, don't animate
        animationShownRef.current = true;
      }
    } catch (error) {
      // If localStorage is not available, we'll still show the animation
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (animationShownRef.current) {
      // Skip animation if already shown
      return;
    }

    // Create an IntersectionObserver to detect when the component is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !animationShownRef.current &&
          supportedTokens.length > 0
        ) {
          // Element is in view, trigger animation
          setAnimateOnScroll(true);

          // Mark as shown to prevent future animations
          animationShownRef.current = true;

          // Save to localStorage that we've shown the hint
          try {
            localStorage.setItem("site_hints", "true");
          } catch (error) {
            console.error("Error setting localStorage:", error);
          }

          // Reset animation after it completes
          setTimeout(() => {
            setAnimateOnScroll(false);
          }, 1000);

          // Stop observing once animation has triggered
          if (componentRef.current) {
            observer.unobserve(componentRef.current);
          }
        }
      },
      {
        // Trigger when the element is 50% visible
        threshold: 0.5,
        // Small negative margin to delay the trigger until more of component is visible
        rootMargin: "-100px 0px",
      },
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [supportedTokens]);

  const displayText =
    mode === "lend"
      ? {
          title: "Lent assets",
          emptyTitle: "No assets supplied yet",
          emptyText: "Providing collateral can earn you APY.",
          actionButton: "Withdraw",
          actionIcon: "/icons/withdraw.svg",
        }
      : {
          title: "Borrowed assets",
          emptyTitle: "No borrows yet",
          emptyText: "You can take out a loan using your supplied collateral.",
          actionButton: "Repay",
          actionIcon: "/icons/repay.svg",
        };

  const containerClass = `${styles.container} ${
    mode === "lend" ? styles.lendContainer : styles.borrowContainer
  } ${showAll ? styles.expanded : ""}`;

  const handleActionClick = (asset: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openModal(mode === "lend" ? "withdraw" : "repay", {
      ...asset,
      ticker: asset.ticker,
    });
  };

  const displayedAssets = showAll
    ? supportedTokens
    : supportedTokens.slice(0, 4);

  if (!showContent) {
    return null;
  }

  return (
    <div className={containerClass} ref={componentRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>{displayText.title}</h2>
        {supportedTokens.length > 4 &&
          (showAll ? (
            <button
              onClick={() => setShowAll(false)}
              className={styles.closeButton}
            >
              <Image src="/icons/close.svg" alt="Close" width={9} height={9} />
            </button>
          ) : (
            <button onClick={() => setShowAll(true)} className={styles.viewAll}>
              View all
            </button>
          ))}
      </div>

      {supportedTokens.length === 0 ? (
        <div className={styles.emptyState}>
          <Image
            src="/icons/noAssets.svg"
            alt="No assets"
            width={120}
            height={120}
            className={styles.emptyStateIcon}
          />
          <h3 className={styles.emptyStateTitle}>{displayText.emptyTitle}</h3>
          <p className={styles.emptyStateText}>{displayText.emptyText}</p>
        </div>
      ) : (
        <div className={styles.assetsList}>
          {displayedAssets.map((asset, index) => (
            <AssetRow
              key={`${mode}-${asset.ticker}`}
              asset={asset}
              mode={mode}
              displayText={displayText}
              onClick={handleActionClick}
              showIndicator={index === 0 && animateOnScroll}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetDisplay;
