import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import styles from "../PositionSummary/PositionSummary.module.css";
import marketDetailsStyles from "./MarketDetails.module.css";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Quantity } from "ao-tokens";

const MarketDetails: React.FC<{
  ticker: string
}> = ({ ticker }) => {
  const { data: protocolStats, isLoading } = useProtocolStats(ticker.toUpperCase());

  const jumpRateActive = useMemo(
    () => {
      if (isLoading || !protocolStats) return false;
      return Quantity.lt(
        new Quantity(0n, BigInt(protocolStats.info.collateralDenomination)).fromString(protocolStats.info.kinkParam),
        protocolStats.utilizationRate
      );
    },
    [protocolStats, isLoading]
  );

  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e: React.MouseEvent, content: string) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setTooltipContent(content);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h2 className={styles.title}>Market details</h2>

        <div className={styles.metricsContainer}>
          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Maximum LTV</p>
              {isLoading && (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "60px", height: "22.5px", borderRadius: "8px" }}
                />
              )}
              {protocolStats && (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {parseFloat(protocolStats.info.collateralFactor).toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                  %
                  <span
                    onMouseMove={(e) => handleMouseMove(e, "The maximum percentage of your collateral that can be borrowed")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src="/icons/information.svg"
                      width={15}
                      height={15}
                      alt="Info icon"
                    />
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Liquidation LTV</p>
              {isLoading && (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "60px", height: "22.5px", borderRadius: "8px" }}
                />
              )}
              {protocolStats && (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {parseFloat(protocolStats.info.liquidationThreshold).toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                  %
                  <span
                    onMouseMove={(e) => handleMouseMove(e, "The percentage of collateralization where your position becomes eligible for liquidation.")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src="/icons/information.svg"
                      width={15}
                      height={15}
                      alt="Info icon"
                    />
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Jump Rate Trigger</p>
              {isLoading && (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "60px", height: "22.5px", borderRadius: "8px" }}
                />
              )}
              {protocolStats && (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {parseFloat(protocolStats.info.kinkParam).toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                  %
                  <span
                    onMouseMove={(e) => handleMouseMove(e, "Beyond this utilization rate, the interest rate rises sharply.")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src="/icons/information.svg"
                      width={15}
                      height={15}
                      alt="Info icon"
                    />
                  </span>
                  {jumpRateActive && (
                    <span className={marketDetailsStyles.jumpRateActive}>
                      Active
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Interest Rate Model for Borrows</p>
              {isLoading && (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "60px", height: "22.5px", borderRadius: "8px" }}
                />
              )}
              {protocolStats && (
                <p className={styles.value}>
                  {(!jumpRateActive && (
                    <>
                      {parseFloat(protocolStats.info.initRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% + "}
                      {parseFloat(protocolStats.info.baseRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% × "}
                      {parseFloat(protocolStats.info.utilization).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% ≈ "}
                      {protocolStats.borrowAPR.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"%"}
                    </>
                  )) || (
                    <>
                      {parseFloat(protocolStats.info.initRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% + "}
                      {parseFloat(protocolStats.info.baseRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% × "}
                      {parseFloat(protocolStats.info.kinkParam).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% + "}
                      {parseFloat(protocolStats.info.jumpRate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% × ("}
                      {parseFloat(protocolStats.info.utilization).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"% - "}
                      {parseFloat(protocolStats.info.kinkParam).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"%) ≈ "}
                      {protocolStats.borrowAPR.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {"%"}
                    </>
                  )}
                </p>
              )}
            </div>
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

export default MarketDetails;
