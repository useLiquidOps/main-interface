"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import styles from "./AssetRow.module.css";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/LiquidOpsData/useGetPosition";
import { useGetPositionBalance } from "@/hooks/LiquidOpsData/useGetPositionBalance";
import { SupportedToken } from "@/hooks/data/useSupportedTokens";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { useModal } from "@/components/PopUp/PopUp";
import Link from "next/link";
import { DEPRECATED_TOKENS } from "@/utils/tokenMappings";
import { useEarnings } from "@/hooks/data/useEarnings";
import { Quantity } from "ao-tokens-lite";

interface AssetRowProps {
  asset: SupportedToken;
  mode: "lend" | "borrow";
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, mode }) => {
  const { tokenAddress } = tokenInput(asset.ticker.toUpperCase());
  const { data: positionBalance } = useGetPosition(tokenAddress);
  const { data: lentBalance } = useGetPositionBalance(tokenAddress);
  const { data: protocolStats } = useProtocolStats(asset.ticker.toUpperCase());

  const modal = useModal();

  const currentBalance = mode === "lend" ? lentBalance : positionBalance;
  const isLoading = mode === "lend" ? !lentBalance : !positionBalance;
  const isProtocolStatsLoading = !protocolStats;

  // Check if the token is deprecated
  const isDeprecated = DEPRECATED_TOKENS.includes(asset.cleanTicker);

  const actionDo = mode === "lend" ? "Supply" : "Borrow";
  const actionReverse = mode === "lend" ? "Withdraw" : "Repay";

  const handleDoAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.openModal(mode === "lend" ? "supply" : "borrow", asset);
  };

  const handleReverseAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.openModal(mode === "lend" ? "withdraw" : "repay", asset);
  };

  const formattedBalance = useMemo(() => {
    if (
      !currentBalance ||
      Quantity.eq(currentBalance, new Quantity(0n, 0n)) ||
      !asset
    ) {
      return "0.0";
    }
    const decimals = Quantity.lt(
      currentBalance,
      new Quantity(0n, asset.baseDenomination).fromNumber(1),
    )
      ? Math.max(Number(asset.baseDenomination), 6)
      : 2;

    return currentBalance.toLocaleString("en-US", {
      // @ts-expect-error
      maximumFractionDigits: decimals,
    });
  }, [asset, currentBalance]);

  // Add class to hide tooltips when modal is open
  const wrapperClasses = `${styles.assetRowWrapper} ${modal.modalType ? "modal-open" : ""}`;

  return (
    <div className={wrapperClasses}>
      <Link href={`/${asset.cleanTicker}`} className={styles.assetRow}>
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
                {formattedBalance} {asset?.cleanTicker}
              </p>
            )}
          </div>
        </div>

        <div className={styles.aprInfo}>
          {isDeprecated ? (
            <p className={styles.deprecated}>Deprecated</p>
          ) : mode === "borrow" && asset.borrowingDisabled ? (
            <div className={styles.borrowingDisabledContainer}>
              <p className={styles.borrowingDisabled}>
                <span>Borrowing</span> <span>disabled</span>
              </p>
              <div className={styles.tooltipContainer}>
                <Image
                  src="/icons/info.svg"
                  alt="Info"
                  width={15}
                  height={15}
                  className={styles.infoIcon}
                />
                <div className={styles.tooltip}>
                  <span>
                    Borrowing will be re-enabled after the AO airdrop is
                    complete, wAR lenders would prefer to earn AO yield instead
                    of native yield from wAR being lent out to borrowers.
                  </span>

                  <span>
                    This ensures lenders still earn AO while using LiquidOps.
                  </span>

                  <span>
                    For now most users are lending wAR to act as collateral to
                    borrow other tokens rather than earn yield.
                  </span>
                </div>
              </div>
            </div>
          ) : isProtocolStatsLoading ? (
            <>
              <SkeletonLoading
                style={{ width: "80px", height: "20px", marginBottom: "8px" }}
              />
              <SkeletonLoading style={{ width: "60px", height: "16px" }} />
            </>
          ) : (
            <>
              <div className={styles.APYRStarsContainer}>
                <Image
                  src={`/icons/${mode === "lend" ? "APYStars" : "APRStars"}.svg`}
                  alt={`Stars icon`}
                  width={10}
                  height={10}
                />
                <p className={styles.apr}>
                  {protocolStats[
                    mode === "lend" ? "supplyAPR" : "borrowAPR"
                  ].toFixed(2)}
                  %
                </p>
              </div>
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
                  {protocolStats.percentChange?.change !== undefined
                    ? !isNaN(Number(protocolStats.percentChange?.change))
                      ? `${protocolStats.percentChange?.change}%`
                      : "0.00%"
                    : "0.00%"}
                </p>
              </div>
            </>
          )}
        </div>

        <div className={styles.actionButtons}>
          {!isDeprecated && (mode === "lend" || !asset.borrowingDisabled) && (
            <button
              className={styles.supplyBorrowButton}
              onClick={handleDoAction}
              type="button"
            >
              {actionDo}
            </button>
          )}
          <button
            className={styles.withdrawRepayButton}
            onClick={handleReverseAction}
            type="button"
          >
            {actionReverse}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default AssetRow;
