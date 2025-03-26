import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./AssetRow.module.css";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { formatTMB } from "@/components/utils/utils";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/LiquidOpsData/useGetPosition";
import { SupportedToken } from "@/hooks/data/useSupportedTokens";
import { Quantity } from "ao-tokens";
import { SkeletonLoading } from "../SkeletonLoading/SkeletonLoading";

interface AssetRowProps {
  asset: SupportedToken;
  mode: "lend" | "borrow";
  displayText: {
    actionButton: string;
    actionIcon: string;
  };
  onClick: (asset: SupportedToken, e?: React.MouseEvent) => void;
  showIndicator?: boolean;
}

const AssetRow: React.FC<AssetRowProps> = ({
  asset,
  mode,
  displayText,
  onClick,
  showIndicator = false,
}) => {
  const { tokenAddress, oTokenAddress } = tokenInput(
    asset.ticker.toUpperCase(),
  );
  const { data: positionBalance } = useGetPosition(tokenAddress);
  const { data: lentBalance } = useUserBalance(oTokenAddress);
  const { data: protocolStats } = useProtocolStats(asset.ticker.toUpperCase());
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle the indicator animation
  useEffect(() => {
    if (showIndicator) {
      setIsAnimating(true);

      // Reset animation after it completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showIndicator]);

  const scaledLentBalance = new Quantity(lentBalance, asset.denomination);
  const currentBalance = mode === "lend" ? scaledLentBalance : positionBalance;
  const isLoading = mode === "lend" ? !scaledLentBalance : !positionBalance;
  const isProtocolStatsLoading = !protocolStats;

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClick(asset, e);
  };

  let formattedBalance;
  if (currentBalance) {
    formattedBalance = formatTMB(currentBalance);
  }

  const rowClass = `${styles.assetRowWrapper} ${isAnimating ? styles.showIndicator : ""}`;

  return (
    <div
      className={rowClass}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.assetRow}>
        <div className={styles.assetInfo}>
          <div className={styles.iconWrapper}>
            <Image src={asset.icon} alt={asset.name} width={40} height={40} />
          </div>
          <div className={styles.nameAmount}>
            <p className={styles.name}>{asset.name}</p>
            {isLoading ? (
              <SkeletonLoading
                className={styles.amount}
                style={{ width: "120px", height: "20px" }}
              />
            ) : (
              <p className={styles.amount}>
                {formattedBalance} {asset?.ticker}
              </p>
            )}
          </div>
        </div>

        <div className={styles.aprInfo}>
          {isProtocolStatsLoading ? (
            <SkeletonLoading
              style={{ width: "80px", height: "20px", marginBottom: "8px" }}
            />
          ) : (
            <p className={styles.apr}>APR {protocolStats.apr.toFixed(2)}%</p>
          )}
          {isProtocolStatsLoading ? (
            <SkeletonLoading style={{ width: "60px", height: "16px" }} />
          ) : (
            <div className={styles.changeInfo}>
              <Image
                src={
                  protocolStats.percentChange?.outcome
                    ? "/icons/APRUp.svg"
                    : "/icons/APRDown.svg"
                }
                alt="APR change indicator"
                width={16}
                height={16}
              />
              <p className={styles.change}>
                {protocolStats.percentChange?.change ?? "0.00"}%
              </p>
            </div>
          )}
        </div>
      </div>
      <button className={styles.withdrawButton} onClick={handleClick}>
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
};

export default AssetRow;
