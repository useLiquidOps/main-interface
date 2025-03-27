import React, { useMemo, useState } from "react";
import styles from "./PositionSummary.module.css";
import { formatTMB } from "../../../components/utils/utils";
import { Quantity } from "ao-tokens";
import { useGlobalPosition } from "@/hooks/LiquidOpsData/useGlobalPosition";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

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

  const { data: globalPosition } = useGlobalPosition();
  const isLoadingPosition = !globalPosition;

  const denomination = 12n;
  const maxBorrow = useMemo(
    () =>
      !globalPosition
        ? new Quantity(0n, 12n)
        : Quantity.__div(
            Quantity.__mul(
              globalPosition.collateralValueUSD,
              new Quantity(0n, denomination).fromNumber(3),
            ),
            new Quantity(0n, denomination).fromNumber(4),
          ),
    [globalPosition],
  );

  const getProgressWidth = (value: Quantity): string => {
    const currentBorrow = Quantity.__sub(
      maxBorrow,
      globalPosition?.availableToBorrowUSD ||
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

  const handleMouseMoveHealthOne = (e: React.MouseEvent) => {
    setTooltipContent(
      `Maximum collateralization: ${healthFactorOne.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`,
    );
    setTooltipPosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const liquidationRisk = useMemo(() => {
    if (
      !globalPosition ||
      Quantity.eq(globalPosition.liquidationPointUSD, new Quantity(0n, 0n))
    )
      return 0;
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
      globalPosition.liquidationPointUSD,
    ).toNumber();
  }, [globalPosition]);

  const healthFactorOne = useMemo(() => {
    if (
      !globalPosition ||
      Quantity.eq(globalPosition.liquidationPointUSD, new Quantity(0n, 0n))
    )
      return 0;

    return Quantity.__div(
      Quantity.__mul(
        globalPosition.borrowCapacityUSD,
        new Quantity(
          0n,
          globalPosition.collateralValueUSD.denomination,
        ).fromNumber(100),
      ),
      globalPosition.liquidationPointUSD,
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
              {isLoadingPosition || !globalPosition ? (
                <SkeletonLoading
                  className={styles.value}
                  style={{ width: "140px", height: "24px" }}
                />
              ) : (
                <p
                  className={styles.value}
                >{`$${Number(formatTMB(globalPosition.collateralValueUSD)).toFixed(2)}`}</p>
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
                  >{`$${Number(formatTMB(globalPosition.borrowCapacityUSD)).toFixed(2)}`}</p>
                )}
                {extraData && !isLoadingPosition && (
                  <div className={styles.redDot} />
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
                    style={{
                      width: getProgressWidth(
                        globalPosition?.borrowCapacityUSD ||
                          new Quantity(0n, 12n),
                      ),
                    }}
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
                >{`$${Number(formatTMB(globalPosition.liquidationPointUSD)).toFixed(2)}`}</p>
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
                >{`$${Number(formatTMB(globalPosition.availableToBorrowUSD)).toFixed(2)}`}</p>
              )}
            </div>
          </div>

          {extraData && (
            <div className={styles.metric}>
              <div className={styles.metricInfo}>
                <p className={styles.label}>Liquidation Risk</p>
                {isLoadingPosition || !globalPosition ? (
                  <SkeletonLoading style={{ width: "100%", height: "24px" }} />
                ) : (
                  <div className={styles.riskContainer}>
                    <p
                      className={styles.value}
                    >{`${liquidationRisk.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`}</p>
                    <div className={styles.riskProgressContainer}>
                      <div
                        className={styles.riskProgress}
                        style={{ width: `${liquidationRisk}%` }}
                      />
                      <div
                        className={styles.riskIndicator}
                        style={{ left: `${healthFactorOne}%` }}
                        onMouseMove={handleMouseMoveHealthOne}
                        onMouseLeave={handleMouseLeave}
                      />
                    </div>
                  </div>
                )}
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
