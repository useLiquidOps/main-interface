import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./AssetRow.module.css";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { formatTMB } from "@/components/utils/utils";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/data/useGetPosition";
import { SupportedToken } from "@/hooks/data/useSupportedTokens";

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

  const currentBalance = mode === "lend" ? lentBalance : positionBalance;
  const isLoading = mode === "lend" ? !lentBalance : !positionBalance;

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClick(asset, e);
  };

  const formattedBalance = currentBalance ? formatTMB(currentBalance) : "0.00";

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
            <p className={styles.amount}>
              {isLoading ? "0.00" : formattedBalance} {asset?.ticker}
            </p>
          </div>
        </div>

        <div className={styles.aprInfo}>
          <p className={styles.apr}>
            APR {protocolStats?.apr.toFixed(2) ?? "0.00"}%
          </p>
          <div className={styles.changeInfo}>
            <Image
              src={
                protocolStats?.percentChange?.outcome
                  ? "/icons/APRUp.svg"
                  : "/icons/APRDown.svg"
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
