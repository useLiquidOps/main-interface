import React, { useMemo, useState } from "react";
import styles from "./PositionSummary.module.css";
import { formatTMB } from "../../../components/utils/utils";
import { Quantity } from "ao-tokens-lite";
import { useGlobalPosition } from "@/hooks/LiquidOpsData/useGlobalPosition";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

const PositionSummary: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const { data: supportedTokens = [] } = useSupportedTokens();

  const tokenData = supportedTokens.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const { data: globalPosition } = useGlobalPosition();
  const isLoadingPosition = !globalPosition;

  const denomination = 12n; // USD denomination
  const maxBorrow = useMemo(
    () =>
      !globalPosition
        ? new Quantity(0n, 12n)
        : new Quantity(
            globalPosition.borrowCapacityUSD || 0,
            denomination,
          ).fromNumber(4),
    [globalPosition],
  );

  const progressWidth = useMemo(() => {
    const zero = new Quantity(0n, 12n);
    const hundred = new Quantity(100n, 12n);

    if (Quantity.eq(maxBorrow, zero) || !globalPosition) {
      return "0%";
    }
    const currentBorrow = new Quantity(
      globalPosition?.borrowBalanceUSD,
      denomination,
    );

    const formattedCurrentBorrow = Quantity.__mul(currentBorrow, hundred);
    const percentage = Quantity.__div(formattedCurrentBorrow, maxBorrow);

    const formatPercent = percentage.toString();

    return `${Number(formatPercent).toFixed(3)}%`;
  }, [maxBorrow, globalPosition]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    const currentBorrow = Quantity.__sub(
      maxBorrow,
      globalPosition?.availableToBorrowUSD ||
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

  const healthFactor = useMemo(() => {
    if (!globalPosition) return undefined;

    const borrowed = Quantity.__sub(
      globalPosition.borrowCapacityUSD,
      globalPosition.availableToBorrowUSD,
    );
    if (
      Quantity.eq(
        borrowed,
        new Quantity(0n, globalPosition.borrowCapacityUSD.denomination),
      )
    )
      return undefined;

    return Quantity.__div(
      globalPosition.liquidationPointUSD,
      borrowed,
    ).toNumber();
  }, [globalPosition]);

  const risk = useMemo<"safe" | "risky" | "liquidation">(() => {
    if (!healthFactor || healthFactor > 1.3) return "safe";
    if (healthFactor >= 1) return "risky";
    return "liquidation";
  }, [healthFactor]);

  const ltv = useMemo(() => {
    if (
      !globalPosition ||
      Quantity.eq(globalPosition.collateralValueUSD, new Quantity(0n, 12n))
    ) {
      return new Quantity(0n, 12n);
    }

    return Quantity.__div(
      Quantity.__mul(
        Quantity.__sub(
          globalPosition.borrowCapacityUSD,
          globalPosition.availableToBorrowUSD,
        ),
        new Quantity(
          0n,
          globalPosition.borrowCapacityUSD.denomination,
        ).fromNumber(100),
      ),
      globalPosition.collateralValueUSD,
    );
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
              {isLoadingPosition || !globalPosition ? (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "140px", height: "24px" }}
                />
              ) : (
                <p
                  className={styles.value}
                >{`$${formatTMB(globalPosition.collateralValueUSD)}`}</p>
              )}
            </div>
            <div className={styles.tokens}>
              {!isLoadingPosition &&
                globalPosition &&
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
              {isLoadingPosition && (
                <SkeletonLoading
                  className={styles.token}
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                />
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Borrow Capacity</p>
              <div className={styles.valueContainer}>
                {isLoadingPosition || !globalPosition ? (
                  <SkeletonLoading
                    className={styles.value}
                    style={{ width: "140px", height: "24px" }}
                  />
                ) : (
                  <p
                    className={styles.value}
                  >{`$${formatTMB(globalPosition.borrowCapacityUSD)}`}</p>
                )}
              </div>
            </div>
            <div
              className={styles.progressContainer}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {isLoadingPosition ? (
                <SkeletonLoading
                  className={styles.progressBackground}
                  style={{ width: "100%" }}
                />
              ) : (
                <>
                  <div
                    className={styles.progressPrimary}
                    style={{ width: progressWidth }}
                  />
                  <div className={styles.progressBackground} />
                </>
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Liquidation Point</p>
              {isLoadingPosition || !globalPosition ? (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "140px", height: "24px" }}
                />
              ) : (
                <p
                  className={styles.value}
                >{`$${formatTMB(globalPosition.liquidationPointUSD)}`}</p>
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Available to Borrow</p>
              {isLoadingPosition || !globalPosition ? (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "140px", height: "24px" }}
                />
              ) : (
                <p
                  className={styles.value}
                >{`$${formatTMB(globalPosition.availableToBorrowUSD)}`}</p>
              )}
            </div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Loan to Value Ratio</p>
              {isLoadingPosition || !globalPosition ? (
                <SkeletonLoading style={{ width: "140px", height: "24px" }} />
              ) : (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {ltv.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
                </p>
              )}
            </div>
          </div>
          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Health Factor</p>
              {isLoadingPosition || !globalPosition ? (
                <SkeletonLoading style={{ width: "140px", height: "24px" }} />
              ) : (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {(healthFactor && (
                    <>
                      {healthFactor.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      <span
                        className={styles.riskIndicator + " " + styles[risk]}
                      >
                        {risk}
                      </span>
                    </>
                  )) ||
                    "--"}
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

export default PositionSummary;
