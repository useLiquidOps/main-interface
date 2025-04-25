"use client";
import React from "react";
import Image from "next/image";
import styles from "./AssetRow.module.css";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { useUserBalance } from "@/hooks/data/useUserBalance";
import { formatTMB } from "@/components/utils/utils";
import { tokenInput } from "liquidops";
import { useGetPosition } from "@/hooks/LiquidOpsData/useGetPosition";
import { SupportedToken } from "@/hooks/data/useSupportedTokens";
import { SkeletonLoading } from "../../../components/SkeletonLoading/SkeletonLoading";
import { useModal } from "../PopUp/PopUp";
import Link from "next/link";

interface AssetRowProps {
  asset: SupportedToken;
  mode: "lend" | "borrow";
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, mode }) => {
  const { tokenAddress, oTokenAddress } = tokenInput(
    asset.ticker.toUpperCase(),
  );
  const { data: positionBalance } = useGetPosition(tokenAddress);
  const { data: lentBalance } = useUserBalance(oTokenAddress);
  const { data: protocolStats } = useProtocolStats(asset.ticker.toUpperCase());

  const modal = useModal();

  const currentBalance = mode === "lend" ? lentBalance : positionBalance;
  const isLoading = mode === "lend" ? !lentBalance : !positionBalance;
  const isProtocolStatsLoading = !protocolStats;

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

        <div className={styles.actionButtons}>
          <button
            className={styles.supplyBorrowButton}
            onClick={handleDoAction}
            type="button"
          >
            {actionDo}
          </button>
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
