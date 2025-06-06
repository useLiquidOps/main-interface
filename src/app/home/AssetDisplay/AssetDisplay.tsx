"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./AssetDisplay.module.css";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import AssetRow from "@/app/home/AssetRow/AssetRow";
import { SUPPORTED_TOKENS } from "@/utils/tokenMappings";

interface AssetDisplayProps {
  mode: "lend" | "borrow";
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ mode }) => {
  const [showContent, setShowContent] = useState(false);
  const { data: supportedTokens = [] } = useSupportedTokens();
  const componentRef = useRef<HTMLDivElement>(null);

  // Delay showing content to avoid empty state flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const displayText =
    mode === "lend"
      ? {
          title: "Lent assets",
        }
      : {
          title: "Borrowed assets",
        };

  const containerClass = `${styles.container} ${
    mode === "lend" ? styles.lendContainer : styles.borrowContainer
  }`;

  if (!showContent) {
    return null;
  }

  // Sort assets based on the assetDisplayOrder defined in SUPPORTED_TOKENS
  const sortedTokens = [...supportedTokens].sort((a, b) => {
    const tokenA = SUPPORTED_TOKENS.find(
      (token) => token.ticker.toUpperCase() === a.ticker.toUpperCase(),
    );
    const tokenB = SUPPORTED_TOKENS.find(
      (token) => token.ticker.toUpperCase() === b.ticker.toUpperCase(),
    );

    // Default order for tokens not found in SUPPORTED_TOKENS
    const orderA = tokenA?.assetDisplayOrder || 999;
    const orderB = tokenB?.assetDisplayOrder || 999;

    return orderA - orderB;
  });

  return (
    <div className={containerClass} ref={componentRef}>
      <div className={styles.header}>
        <h2 className={styles.title}>{displayText.title}</h2>
      </div>

      <div className={styles.assetsList}>
        {sortedTokens.map((asset, index) => (
          <AssetRow key={`${mode}-${asset.ticker}`} asset={asset} mode={mode} />
        ))}
      </div>
    </div>
  );
};

export default AssetDisplay;
