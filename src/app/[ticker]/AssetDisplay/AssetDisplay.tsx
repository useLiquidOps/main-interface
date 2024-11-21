import React, { useMemo, useState } from "react";
import styles from "./AssetDisplay.module.css";
import Image from "next/image";
import { useModal } from "../PopUp/PopUp";

interface Asset {
  icon: string;
  oIcon: string;
  name: string;
  amount: string;
  symbol: string;
  apr: string;
  change: string;
  isPositive: boolean;
  extraAmount?: string;
}

interface AssetDisplayProps {
  mode: "lend" | "borrow";
  assets: Asset[];
  maxYield?: string;
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({
  mode,
  assets,
  maxYield,
}) => {
  const [showAll, setShowAll] = useState(false);
  const { openModal } = useModal();

  const displayedAssets = showAll ? assets : assets.slice(0, 4);

  const getDisplayText = () => {
    if (mode === "lend") {
      return {
        title: "Yielding assets",
        emptyTitle: "No assets supplied yet",
        emptyText: `Providing collateral can earn you up to ${maxYield}% APY`,
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

  const handleActionClick = (asset: Asset, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    openModal(mode === "lend" ? "withdraw" : "repay", asset);
  };

  return (
    <div className={styles.container + " " + (showAll ? styles.expanded : "")}>
      <div className={styles.header}>
        <h2 className={styles.title}>{displayText.title}</h2>
        {assets.length > 4 &&
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

      {assets.length === 0 ? (
        <div className={styles.emptyState}>
          <Image
            src="/icons/noAssets.png"
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
                      {asset.amount}
                      {mode === "borrow" &&
                        asset.extraAmount &&
                        ` + ${asset.extraAmount} ${asset.symbol}`}
                    </p>
                  </div>
                </div>

                <div className={styles.aprInfo}>
                  <p className={styles.apr}>APR {asset.apr}%</p>
                  <div className={styles.changeInfo}>
                    <Image
                      src={
                        asset.isPositive
                          ? "/icons/APRUp.svg"
                          : "/icons/APRDown.svg"
                      }
                      alt="APR change indicator"
                      width={16}
                      height={16}
                    />
                    <p className={styles.change}>{asset.change}%</p>
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
                  width={18}
                  height={18}
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
