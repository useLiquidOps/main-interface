import React, { useMemo, useState } from "react";
import styles from "./PositionSummary.module.css";
import { formatTMB } from "../../../components/utils/utils";
import { Quantity } from "ao-tokens";
import { useGlobalPosition } from "@/hooks/data/useGlobalPosition";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";

const PositionSummary: React.FC<{
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

  const { data: globalPosition } = useGlobalPosition(tokenData?.ticker);

  const denomination = 12n;
  const maxBorrow = useMemo(
    () =>
      !globalPosition
        ? new Quantity(0n, 12n)
        : Quantity.__div(
            Quantity.__mul(
              globalPosition.collateralValue,
              new Quantity(0n, denomination).fromNumber(3),
            ),
            new Quantity(0n, denomination).fromNumber(4),
          ),
    [globalPosition],
  );

  const getProgressWidth = (value: Quantity): string => {
    const currentBorrow = Quantity.__sub(
      maxBorrow,
      globalPosition?.availableToBorrow ||
        new Quantity(0n, maxBorrow.denomination),
    );
    if (maxBorrow.toNumber() === 0) return "0%";
    return (
      Quantity.__div(
        Quantity.__mul(
          currentBorrow,
          new Quantity(0n, denomination).fromNumber(100),
        ),
        maxBorrow,
      ).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "%"
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    const currentBorrow = Quantity.__sub(
      maxBorrow,
      globalPosition?.availableToBorrow ||
        new Quantity(0n, maxBorrow.denomination),
    );
    const currentBorrowPercentage = (
      !Quantity.eq(maxBorrow, new Quantity(0n, maxBorrow.denomination))
        ? Quantity.__div(
            Quantity.__mul(
              currentBorrow,
              new Quantity(0n, denomination).fromNumber(100),
            ),
            maxBorrow,
          )
        : new Quantity(0n, maxBorrow.denomination)
    ).toNumber();

    let tooltipText = "";
    if (percentage <= currentBorrowPercentage) {
      tooltipText = `Current Borrow: ${currentBorrowPercentage.toFixed(1)}%`;
    } else {
      tooltipText = `Available to Borrow: ${(100 - currentBorrowPercentage).toFixed(1)}%`;
    }

    setTooltipContent(tooltipText);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const liquidationRisk = useMemo(() => {
    if (!globalPosition || globalPosition.liquidationPoint.toNumber() === 0)
      return 0;
    return Quantity.__div(
      Quantity.__mul(
        Quantity.__sub(
          globalPosition.borrowCapacity,
          globalPosition.availableToBorrow,
        ),
        new Quantity(0n, globalPosition.borrowCapacity.denomination).fromNumber(
          100,
        ),
      ),
      globalPosition.liquidationPoint,
    ).toNumber();
  }, [globalPosition]);

  if (!tokenData) {
    return <></>;
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h2 className={styles.title}>Position summary</h2>

        <div className={styles.metricsContainer}>
          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Collateral Value</p>
              <p
                className={styles.value}
              >{`${globalPosition ? formatTMB(globalPosition.collateralValue) : "0"} ${tokenData.ticker}`}</p>
            </div>
            <div className={styles.tokens}>
              {globalPosition &&
                globalPosition.collateralLogos.map((logo, i) => (
                  <img
                    key={i}
                    src={`https://arweave.net/${logo}`}
                    alt="collateral logo"
                    className={styles.token}
                    style={{
                      zIndex: globalPosition.collateralLogos.length - i,
                    }}
                  />
                ))}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Borrow Capacity</p>
              <div className={styles.valueContainer}>
                <p
                  className={styles.value}
                >{`${globalPosition ? formatTMB(globalPosition.borrowCapacity) : "0"} ${tokenData.ticker}`}</p>
                {extraData && <div className={styles.redDot} />}
              </div>
            </div>
            <div
              className={styles.progressContainer}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={styles.progressPrimary}
                style={{
                  width: getProgressWidth(
                    globalPosition?.borrowCapacity || new Quantity(0n, 12n),
                  ),
                }}
              />
              <div className={styles.progressBackground} />
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Liquidation Point</p>
              <p
                className={styles.value}
              >{`${globalPosition ? formatTMB(globalPosition?.liquidationPoint) : "0"} ${tokenData.ticker}`}</p>
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Available to Borrow</p>
              <p
                className={styles.value}
              >{`${globalPosition ? formatTMB(globalPosition.availableToBorrow) : "0"} ${tokenData.ticker}`}</p>
            </div>
          </div>

          {extraData && globalPosition && (
            <div className={styles.metric}>
              <div className={styles.metricInfo}>
                <p className={styles.label}>Liquidation Risk</p>
                <div className={styles.riskContainer}>
                  <p className={styles.value}>{`${liquidationRisk}%`}</p>
                  <div className={styles.riskProgressContainer}>
                    <div
                      className={styles.riskProgress}
                      style={{ width: `${liquidationRisk}%` }}
                    />
                    <div
                      className={styles.riskIndicator}
                      style={{ left: `${liquidationRisk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default PositionSummary;
