"use client";
import React, { useState } from "react";
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
  const { openModal } = useModal();
  const { data: supportedTokens = [] } = useSupportedTokens();

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

  return (
    <div className={containerClass}>
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
          {displayedAssets.map((asset) => (
            <AssetRow
              key={`${mode}-${asset.ticker}`}
              asset={asset}
              mode={mode}
              displayText={displayText}
              onClick={handleActionClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetDisplay;
