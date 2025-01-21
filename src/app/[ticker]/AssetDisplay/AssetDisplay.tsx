"use client";
import React, { useState } from "react";
import styles from "./AssetDisplay.module.css";
import Image from "next/image";
import { useModal } from "../PopUp/PopUp";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { formatTMB } from "@/components/utils/utils";

interface AssetDisplayProps {
  mode: "lend" | "borrow";
  tokens: Array<{
    icon: string;
    oIcon: string;
    name: string;
    symbol: string;
  }>;
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({
  mode,
  tokens,
}) => {
  const [showAll, setShowAll] = useState(false);
  const { openModal } = useModal();

  // TODO: find actual data and replace this
  const extraAmount = 1;

  const displayedAssets = showAll ? tokens : tokens.slice(0, 4);

  const getDisplayText = () => {
    if (mode === "lend") {
      return {
        title: "Yielding assets",
        emptyTitle: "No assets supplied yet",
        emptyText: `Providing collateral can earn you APY.`,
        actionButton: "Withdraw",
        actionIcon: "/icons/withdraw.svg",
      };
    }
    return {
      title: "Borrowed assets",
      emptyTitle: "No borrows yet",
      emptyText: "You can take out a loan using your supplied collateral.",
      actionButton: "Repay",
      actionIcon: "/icons/repay.svg",
    };
  };

  const displayText = getDisplayText();

  const containerClass = `${styles.container} ${
    mode === "lend" ? styles.lendContainer : styles.borrowContainer
  } ${showAll ? styles.expanded : ""}`;

  const handleActionClick = (
    asset: (typeof tokens)[0],
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    openModal(mode === "lend" ? "withdraw" : "repay", asset);
  };

  return (
    <div className={containerClass}>
      <div className={styles.header}>
        <h2 className={styles.title}>{displayText.title}</h2>
        {tokens.length > 4 &&
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

      {tokens.length === 0 ? (
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
          {displayedAssets.map((asset, index) => {
            const { data: protocolStats } = useProtocolStats(
              asset.symbol.toUpperCase(),
            );
            const { data: balance, isLoading } = useUserBalance(
              asset.symbol.toUpperCase(),
            );

            return (
              <div
                key={`${mode}-${asset.name}-${index}`}
                className={styles.assetRowWrapper}
                onClick={() => handleActionClick(asset)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.assetRow}>
                  <div className={styles.assetInfo}>
                    <div className={styles.iconWrapper}>
                      <Image
                        src={asset.icon}
                        alt={asset.name}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className={styles.nameAmount}>
                      <p className={styles.name}>{asset.name}</p>
                      <p className={styles.amount}>
                        {isLoading ? "0.00" : formatTMB(balance ?? 0)}{" "}
                        {asset?.symbol}
                        {mode === "borrow" &&
                          (isLoading
                            ? ` + 0.00 ${asset?.symbol}`
                            : ` + ${formatTMB(Number(extraAmount))} ${asset?.symbol}`)}
                      </p>
                    </div>
                  </div>

                  <div className={styles.aprInfo}>
                    <p className={styles.apr}>
                      APR {protocolStats?.apr ?? "0.00"}%
                    </p>
                    <div className={styles.changeInfo}>
                      <Image
                        src={
                          protocolStats?.percentChange
                            ? protocolStats.percentChange.outcome
                              ? "/icons/APRUp.svg"
                              : "/icons/APRDown.svg"
                            : "/icons/APRUp.svg"
                        }
                        alt="APR change indicator"
                        width={16}
                        height={16}
                      />
                      <p className={styles.change}>
                        {protocolStats?.percentChange?.change ?? "0.00"}%
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.withdrawButton}
                  onClick={(e) => handleActionClick(asset, e)}
                >
                  <Image
                    src={displayText.actionIcon}
                    alt={displayText.actionButton}
                    width={14}
                    height={14}
                    className={styles.withdrawIcon}
                  />
                  <span>{displayText.actionButton}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssetDisplay;
