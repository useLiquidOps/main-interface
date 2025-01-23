"use client";
import React, { useState } from "react";
import styles from "./AssetDisplay.module.css";
import Image from "next/image";
import { useModal } from "../PopUp/PopUp";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { formatTMB } from "@/components/utils/utils";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/data/useGetPosition";
import { AssetDisplayData } from "@/app/data";

interface AssetDisplayProps {
  mode: "lend" | "borrow";
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ mode }) => {
  const [showAll, setShowAll] = useState(false);
  const { openModal } = useModal();

  const displayText =
    mode === "lend"
      ? {
          title: "Yielding assets",
          emptyTitle: "No assets supplied yet",
          emptyText: `Providing collateral can earn you APY.`,
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

  const handleActionClick = (
    asset: (typeof AssetDisplayData)[0],
    e?: React.MouseEvent,
  ) => {
    if (e) e.stopPropagation();
    openModal(mode === "lend" ? "withdraw" : "repay", asset);
  };

  const tokens = AssetDisplayData.map((asset) => {
    const { tokenAddress, oTokenAddress } = tokenInput(
      asset.ticker.toUpperCase(),
    );
    const { data: positionBalance } = useGetPosition(tokenAddress);
    const { data: lentBalance } = useUserBalance(oTokenAddress);
    const { data: protocolStats } = useProtocolStats(
      asset.ticker.toUpperCase(),
    );

    const currentBalance = mode === "lend" ? lentBalance : positionBalance;
    const isLoading = mode === "lend" ? !lentBalance : !positionBalance;

    return {
      ...asset,
      currentBalance,
      isLoading,
      protocolStats,
    };
  }).filter((token) => token.currentBalance && token.currentBalance.raw !== 0n);

  const displayedAssets = showAll ? tokens : tokens.slice(0, 4);

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
          {displayedAssets.map((asset, index) => (
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
                      {asset.isLoading || !asset.currentBalance
                        ? "0.00"
                        : formatTMB(asset.currentBalance)}{" "}
                      {asset?.ticker}
                    </p>
                  </div>
                </div>

                <div className={styles.aprInfo}>
                  <p className={styles.apr}>
                    APR {asset.protocolStats?.apr ?? "0.00"}%
                  </p>
                  <div className={styles.changeInfo}>
                    <Image
                      src={
                        asset.protocolStats?.percentChange
                          ? asset.protocolStats.percentChange.outcome
                            ? "/icons/APRUp.svg"
                            : "/icons/APRDown.svg"
                          : "/icons/APRUp.svg"
                      }
                      alt="APR change indicator"
                      width={16}
                      height={16}
                    />
                    <p className={styles.change}>
                      {asset.protocolStats?.percentChange?.change ?? "0.00"}%
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetDisplay;
