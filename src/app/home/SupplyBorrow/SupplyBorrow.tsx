import React, { useState } from "react";
import styles from "./SupplyBorrow.module.css";
import { useGlobalPosition } from "@/hooks/LiquidOpsData/useGlobalPosition";
import { Quantity } from "ao-tokens";
import { formatTMB } from "@/components/utils/utils";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

interface SupplyBorrowProps {}

const SupplyBorrow: React.FC<SupplyBorrowProps> = () => {
  const { data: globalPosition } = useGlobalPosition();
  const isLoading = !globalPosition;

  const suppliedAmount = globalPosition?.collateralValueUSD;
  const borrowedAmount = globalPosition?.borrowCapacityUSD;

  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const getProgressWidth = (value: number): string => {
    return `${value}%`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const totalWidth = rect.width;

    const totalValue =
      Number(suppliedAmount || 0) + Number(borrowedAmount || 0);
    const suppliedWidth =
      (Number(suppliedAmount || 0) / totalValue) * totalWidth;

    let tooltipText = "";
    if (x <= suppliedWidth) {
      const supplyPercentage = (Number(suppliedAmount || 0) / totalValue) * 100;
      tooltipText = `Supplied tokens: ${supplyPercentage.toFixed(2)}%`;
    } else {
      const borrowPercentage = (Number(borrowedAmount || 0) / totalValue) * 100;
      tooltipText = `Borrowed tokens: ${borrowPercentage.toFixed(2)}%`;
    }

    setTooltipContent(tooltipText);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(!!tooltipText);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.lendVsBorrows}>
          <div className={styles.lendBorrow}>
            {isLoading ? (
              <SkeletonLoading
                className={styles.valueWithIndicator}
                style={{ width: "70px", height: "22px" }}
              />
            ) : (
              <p className={styles.amount}>
                ${formatTMB(suppliedAmount || new Quantity(0n, 12n))}
              </p>
            )}

            <div className={styles.card2TitleContainer}>
              <div className={styles.indicatorGreen}></div>
              <p>Supplied</p>
            </div>
          </div>
          <div className={styles.lendBorrow}>
            {isLoading ? (
              <SkeletonLoading
                className={styles.valueWithIndicator}
                style={{ width: "70px", height: "22px" }}
              />
            ) : (
              <p className={styles.amount}>
                ${formatTMB(borrowedAmount || new Quantity(0n, 12n))}
              </p>
            )}
            <div className={styles.card2TitleContainer}>
              <div className={styles.indicatorBlue}></div>
              <p>Borrowed</p>
            </div>
          </div>
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
                  width: getProgressWidth(Number(suppliedAmount || 0)),
                }}
              />
              <div
                className={styles.progressBlue}
                style={{
                  width: getProgressWidth(Number(borrowedAmount || 0)),
                }}
              />
            </>
          )}
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
    </>
  );
};

export default SupplyBorrow;
