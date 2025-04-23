import React, { useState } from "react";
import styles from "./Market.module.css";
import { formatTMB } from "../../../components/utils/utils";
import Image from "next/image";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { Quantity } from "ao-tokens";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

const Market: React.FC<{
  ticker: string;
  extraData?: boolean;
}> = ({ ticker, extraData = false }) => {
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const { data: supportedTokens = [] } = useSupportedTokens();

  const tokenData = supportedTokens.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const { data: protocolStats } = useProtocolStats(ticker.toUpperCase());
  const isLoading = !protocolStats;

  const getProgressWidth = (value: number): string => {
    const total =
      Number(protocolStats?.unLent || 0) + Number(protocolStats?.borrows || 0);
    return total > 0 ? `${(value / total) * 100}%` : "0%";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const totalWidth = rect.width;

    const totalValue =
      Number(protocolStats?.unLent || 0) + Number(protocolStats?.borrows || 0);

    const unlentWidth =
      (Number(protocolStats?.unLent || 0) / totalValue) * totalWidth;

    let tooltipText = "";
    if (x <= unlentWidth) {
      const availablePercentage =
        (Number(protocolStats?.unLent || 0) / totalValue) * 100;
      tooltipText = `Available Lent Tokens: ${availablePercentage.toFixed(1)}%`;
    } else {
      const borrowsPercentage =
        (Number(protocolStats?.borrows || 0) / totalValue) * 100;
      tooltipText = `Total Borrows: ${borrowsPercentage.toFixed(1)}%`;
    }

    setTooltipContent(tooltipText);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(!!tooltipText);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  if (!tokenData) {
    return null;
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h2 className={styles.title}>{tokenData.name} market</h2>

        <div className={styles.metricsContainer}>
          {extraData && (
            <div className={styles.metric}>
              <p className={styles.label}>Supply APR</p>

              <div className={styles.APRContainer}>
                {isLoading ? (
                  <SkeletonLoading
                    className={styles.value}
                    style={{ width: "120px", height: "24px" }}
                  />
                ) : (
                  <div className={styles.flexDisplay}>
                    <p className={styles.value}>
                      {(protocolStats?.supplyAPR).toFixed(2) || "0.00"}%
                    </p>
                    <Image
                      src={
                        protocolStats?.percentChange?.outcome === false
                          ? "/icons/APRdown.svg"
                          : "/icons/APRup.svg"
                      }
                      alt={
                        protocolStats?.percentChange?.outcome === false
                          ? "APR Down"
                          : "APR Up"
                      }
                      width={24}
                      height={24}
                    />
                    <p className={styles.extraData}>
                      {protocolStats?.percentChange.change || "0.00"}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.metric}>
            <p className={styles.label}>Total Supply</p>
            {isLoading ? (
              <SkeletonLoading
                className={styles.value}
                style={{ width: "160px", height: "24px" }}
              />
            ) : (
              <div className={styles.flexDisplay}>
                <p className={styles.value}>
                  {`${formatTMB(protocolStats?.protocolBalance || new Quantity(0n, 12n))} ${tokenData.ticker}`}
                </p>
              </div>
            )}
          </div>

          <div className={styles.metric}>
            <p className={styles.label}>Available Lent Tokens</p>
            {isLoading ? (
              <SkeletonLoading
                className={styles.valueWithIndicator}
                style={{ width: "160px", height: "24px" }}
              />
            ) : (
              <div className={styles.valueWithIndicator}>
                <p className={styles.value}>
                  {`${formatTMB(protocolStats?.unLent || new Quantity(0n, 12n))} ${tokenData.ticker}`}
                </p>
                <div className={styles.indicatorGreen}></div>
              </div>
            )}
          </div>

          <div className={styles.metric}>
            <p className={styles.label}>Total Borrows</p>
            {isLoading ? (
              <SkeletonLoading
                className={styles.valueWithIndicator}
                style={{ width: "160px", height: "24px" }}
              />
            ) : (
              <div className={styles.valueWithIndicator}>
                <p className={styles.value}>
                  {`${formatTMB(protocolStats?.borrows || new Quantity(0n, 12n))} ${tokenData.ticker}`}
                </p>
                <div className={styles.indicatorBlue}></div>
              </div>
            )}
          </div>

          <div
            className={styles.progressBar}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {isLoading ? (
              <SkeletonLoading style={{ width: "100%", height: "100%" }} />
            ) : (
              <>
                <div
                  className={styles.progressGreen}
                  style={{
                    width: getProgressWidth(Number(protocolStats?.unLent || 0)),
                  }}
                />
                <div
                  className={styles.progressBlue}
                  style={{
                    width: getProgressWidth(
                      Number(protocolStats?.borrows || 0),
                    ),
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {showTooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 25}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default Market;
