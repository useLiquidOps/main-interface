import React from "react";
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
  onHasBalance: (hasBalance: boolean) => void;
}

const AssetRow: React.FC<AssetRowProps> = ({
  asset,
  mode,
  displayText,
  onClick,
  onHasBalance,
}) => {
  const { tokenAddress, oTokenAddress } = tokenInput(
    asset.ticker.toUpperCase()
  );
  const { data: positionBalance } = useGetPosition(tokenAddress);
  const { data: lentBalance } = useUserBalance(oTokenAddress);
  const { data: protocolStats } = useProtocolStats(asset.ticker.toUpperCase());

  const currentBalance = mode === "lend" ? lentBalance : positionBalance;
  const isLoading = mode === "lend" ? !lentBalance : !positionBalance;

  React.useEffect(() => {
    if (!isLoading) {
      onHasBalance(Boolean(currentBalance && Number(currentBalance) > 0));
    }
  }, [currentBalance, isLoading, onHasBalance]);

  if (!currentBalance || Number(currentBalance) === 0) {
    return null;
  }

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClick(asset, e);
  };

  return (
    <div
      className={styles.assetRowWrapper}
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
              {isLoading ? "0.00" : formatTMB(currentBalance)} {asset?.ticker}
            </p>
          </div>
        </div>

        <div className={styles.aprInfo}>
          <p className={styles.apr}>APR {protocolStats?.apr ?? "0.00"}%</p>
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