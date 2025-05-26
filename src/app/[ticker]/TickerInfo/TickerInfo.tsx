"use client";
import React from "react";
import styles from "./TickerInfo.module.css";
import { useModal } from "@/components/PopUp/PopUp";
import Image from "next/image";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { formatTMB } from "@/components/utils/utils";
import { Quantity } from "ao-tokens";
import { useTokenPrice } from "@/hooks/data/useTokenPrice";
import { DEPRECATED_TOKENS } from "@/utils/tokenMappings";

const TickerInfo: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const { data: supportedTokens = [] } = useSupportedTokens();

  const asset = supportedTokens?.find(
    (token) => token.ticker.toLowerCase() === ticker?.toString().toLowerCase(),
  );

  const { data: protocolStats } = useProtocolStats(ticker.toUpperCase());
  const isLoading = !protocolStats;

  const { price: tokenPrice, isLoading: isLoadingPrice } = useTokenPrice(
    ticker.toUpperCase(),
  );

  // Check if the token is deprecated
  const isDeprecated = asset ? DEPRECATED_TOKENS.includes(asset.ticker) : false;

  const modal = useModal();

  const handleSupply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.openModal("supply", asset);
  };

  const handleWithdraw = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.openModal("withdraw", asset);
  };

  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.openModal("borrow", asset);
  };

  const handleRepay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    modal.openModal("repay", asset);
  };

  return (
    <div className={styles.container}>
      <div className={styles.assetInfo}>
        {asset && (
          <>
            <Image src={asset.icon} alt={asset.name} width={40} height={40} />

            <h2 className={styles.tickerTitle}>{ticker}</h2>
          </>
        )}
      </div>

      <div className={styles.marketDetails}>
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>Total Supply</p>
          {isLoading ? (
            <SkeletonLoading style={{ width: "70px", height: "20px" }} />
          ) : (
            <p className={styles.detailContent}>
              {`${formatTMB(protocolStats?.protocolBalance || new Quantity(0n, 12n))}`}
            </p>
          )}
        </div>
        <div className={styles.detailContainer}>
          <div className={styles.indicatorContainer}>
            <p className={styles.detailTitle}>Available Lends</p>
            <div className={styles.indicatorGreen}></div>
          </div>
          {isLoading ? (
            <SkeletonLoading style={{ width: "70px", height: "20px" }} />
          ) : (
            <p className={styles.detailContent}>
              {`${formatTMB(protocolStats?.unLent || new Quantity(0n, 12n))}`}
            </p>
          )}
        </div>
        <div className={styles.detailContainer}>
          <div className={styles.indicatorContainer}>
            <p className={styles.detailTitle}>Total Borrowed</p>
            <div className={styles.indicatorBlue}></div>
          </div>
          {isLoading ? (
            <SkeletonLoading style={{ width: "70px", height: "20px" }} />
          ) : (
            <p className={styles.detailContent}>
              {`${formatTMB(protocolStats?.borrows || new Quantity(0n, 12n))}`}
            </p>
          )}
        </div>
        <div className={styles.detailContainer}>
          <p className={styles.detailTitle}>Oracle Price</p>

          {isLoadingPrice ? (
            <SkeletonLoading style={{ width: "70px", height: "20px" }} />
          ) : (
            <p className={styles.detailContent}>
              {`$${formatTMB(tokenPrice || new Quantity(0n, 12n))}`}
            </p>
          )}
        </div>
      </div>

      <div className={styles.actionButtonsContainer}>
        {isDeprecated && (
          <div className={styles.deprecatedNotice}>
            <p className={styles.deprecated}>Deprecated pool</p>
          </div>
        )}
        <div className={styles.actionButtons}>
          {!isDeprecated && (
            <>
              <button
                className={styles.supplyButton}
                onClick={handleSupply}
                type="button"
              >
                Supply
              </button>
              <button
                className={styles.borrowButton}
                onClick={handleBorrow}
                type="button"
              >
                Borrow
              </button>
            </>
          )}
          <button
            className={styles.withdrawButton}
            onClick={handleWithdraw}
            type="button"
          >
            Withdraw
          </button>
          <button
            className={styles.repayButton}
            onClick={handleRepay}
            type="button"
          >
            Repay
          </button>
        </div>
      </div>
    </div>
  );
};

export default TickerInfo;
