"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import styles from "./AssetRow.module.css";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/LiquidOpsData/useGetPosition";
import { useGetPositionBalance } from "@/hooks/LiquidOpsData/useGetPositionBalance";
import { SupportedToken } from "@/hooks/data/useSupportedTokens";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { useModal } from "@/components/PopUp/PopUp";
import Link from "next/link";
import { DEPRECATED_TOKENS } from "@/utils/tokenMappings";
import { useEarnings } from "@/hooks/data/useEarnings";
import { Quantity } from "ao-tokens";

interface AssetRowProps {
  asset: SupportedToken;
  mode: "lend" | "borrow";
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, mode }) => {
  const { tokenAddress } = tokenInput(asset.ticker.toUpperCase());
  const { data: positionBalance } = useGetPosition(tokenAddress);
  const { data: lentBalance } = useGetPositionBalance(tokenAddress);
  const { data: protocolStats } = useProtocolStats(asset.ticker.toUpperCase());
  // const { data: earnings } = useEarnings(asset.ticker.toUpperCase());

  // const qtyEarnings = useMemo(
  //   () => ({
  //     base: new Quantity(earnings?.base || 0n, asset?.baseDenomination || 0n),
  //     profit: new Quantity(earnings?.profit || 0n, asset?.baseDenomination || 0n)
  //   }),
  //   [earnings, asset]
  // );

  const modal = useModal();

  const currentBalance = mode === "lend" ? lentBalance : positionBalance;
  const isLoading = mode === "lend" ? !lentBalance : !positionBalance;
  const isProtocolStatsLoading = !protocolStats;

  // Check if the token is deprecated
  const isDeprecated = DEPRECATED_TOKENS.includes(asset.ticker);

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

  let formattedBalance;
  if (currentBalance) {
    formattedBalance = formatTMB(currentBalance);
  }

  return (
    <div className={styles.assetRowWrapper}>
      <Link href={`/${asset.ticker}`} className={styles.assetRow}>
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
                {/* {(mode === "lend" && (
                  <>
                    {qtyEarnings?.base?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || "0"}
                    {qtyEarnings?.profit && !Quantity.eq(qtyEarnings.profit, new Quantity(0n, 0n)) && (
                      <>
                        {" + "}
                        <span className={styles.earned}>
                          {qtyEarnings?.profit?.toLocaleString(undefined, { maximumFractionDigits: Number(asset?.denomination) as any || 12 }) || "0"}
                        </span>
                      </>
                    )}
                  </>
                )) || formattedBalance} */}
                {formattedBalance} {asset?.ticker}
              </p>
            )}
          </div>
        </div>

        <div className={styles.aprInfo}>
          {isDeprecated ? (
            <p className={styles.deprecated}>Deprecated</p>
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
          {!isDeprecated && (
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
