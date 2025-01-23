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

interface DisplayText {
  title: string;
  emptyTitle: string;
  emptyText: string;
  actionButton: string;
  actionIcon: string;
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ mode }) => {
  const [showAll, setShowAll] = useState(false);
  const [visibleAssets, setVisibleAssets] = useState(0);
  const { openModal } = useModal();
  const { data: supportedTokens = [] } = useSupportedTokens();

  const displayText: DisplayText =
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
    openModal(mode === "lend" ? "withdraw" : "repay", asset);
  };

  const displayedAssets = showAll
    ? supportedTokens
    : supportedTokens.slice(0, 4);

  const handleHasBalance = React.useCallback((hasBalance: boolean) => {
    setVisibleAssets((prev) => (hasBalance ? prev + 1 : prev));
  }, []);

  return (
    <div className={containerClass}>
      <div className={styles.header}>
        <h2 className={styles.title}>{displayText.title}</h2>
        {visibleAssets > 4 &&
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

      {visibleAssets === 0 ? (
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
              key={`${mode}-${asset.name}-${index}`}
              asset={asset}
              mode={mode}
              displayText={displayText}
              onClick={handleActionClick}
              onHasBalance={handleHasBalance}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetDisplay;