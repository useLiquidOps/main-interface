import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import styles from "../PositionSummary/PositionSummary.module.css";
import marketDetailsStyles from "./MarketDetails.module.css";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Quantity } from "ao-tokens";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { parse } from "next/dist/build/swc";

const MarketDetails: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const { data: protocolStats, isLoading } = useProtocolStats(
    ticker.toUpperCase(),
  );

  const jumpRateActive = useMemo(() => {
    if (isLoading || !protocolStats) return false;
    return Quantity.lt(
      new Quantity(
        0n,
        BigInt(protocolStats.info.collateralDenomination),
      ).fromString(protocolStats.info.kinkParam),
      protocolStats.utilizationRate,
    );
  }, [protocolStats, isLoading]);

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

  const interestRateModelData = useMemo(() => {
    if (!protocolStats) return undefined;

    const kinkParam = parseFloat(protocolStats.info.kinkParam);
    const baseRate = parseFloat(protocolStats.info.baseRate);
    const jumpRate = parseFloat(protocolStats.info.jumpRate);
    const initRate = parseFloat(protocolStats.info.initRate);
    const data = [];

    for (let i = 0; i < 100; i++) {
      const utilization = i / 100;
      let apy = initRate;

      if (utilization <= kinkParam) {
        apy += utilization * baseRate;
      } else {
        apy += kinkParam * baseRate / 100 + (utilization - kinkParam / 100) * jumpRate;
      }

      data.push({ apy, utilization });
    }

    return data;
  }, [protocolStats]);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h2 className={styles.title}>Market details</h2>

        <div className={styles.metricsContainer}>
          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Maximum LTV</p>
              {(protocolStats && (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {parseFloat(
                    protocolStats.info.collateralFactor,
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  %
                  <span
                    onMouseMove={(e) =>
                      handleMouseMove(
                        e,
                        "The maximum percentage of your collateral that can be borrowed",
                      )
                    }
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
              )) || (
                <SkeletonLoading
                  className={styles.value}
                  style={{
                    width: "60px",
                    height: "22.5px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Liquidation LTV</p>
              {(protocolStats && (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {parseFloat(
                    protocolStats.info.liquidationThreshold,
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  %
                  <span
                    onMouseMove={(e) =>
                      handleMouseMove(
                        e,
                        "The percentage of collateralization where your position becomes eligible for liquidation.",
                      )
                    }
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
              )) || (
                <SkeletonLoading
                  className={styles.value}
                  style={{
                    width: "60px",
                    height: "22.5px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Jump Rate Trigger</p>
              {(protocolStats && (
                <p className={styles.value + " " + styles.flexboxValue}>
                  {parseFloat(protocolStats.info.kinkParam).toLocaleString(
                    undefined,
                    {
                      maximumFractionDigits: 2,
                    },
                  )}
                  %
                  <span
                    onMouseMove={(e) =>
                      handleMouseMove(
                        e,
                        "Beyond this utilization rate, the interest rate rises sharply.",
                      )
                    }
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
              )) || (
                <SkeletonLoading
                  className={styles.value}
                  style={{
                    width: "60px",
                    height: "22.5px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles.metric}>
            <div className={styles.metricInfo}>
              <p className={styles.label}>Interest Rate Model for Borrows</p>
              {(protocolStats && (
                <p className={styles.value}>
                  {(!jumpRateActive && (
                    <>
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) => handleMouseMove(e, "Init Rate")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(protocolStats.info.initRate).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" + "}
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) => handleMouseMove(e, "Base Rate")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(protocolStats.info.baseRate).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" × "}
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) => handleMouseMove(e, "Utilization")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(
                          protocolStats.info.utilization,
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" ≈ "}
                      {protocolStats.borrowAPR.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      {"%"}
                    </>
                  )) || (
                    <>
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) => handleMouseMove(e, "Init Rate")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(protocolStats.info.initRate).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" + "}
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) => handleMouseMove(e, "Base Rate")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(protocolStats.info.baseRate).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" × "}
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) =>
                          handleMouseMove(e, "Jump Rate Trigger Utilization")
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(
                          protocolStats.info.kinkParam,
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" + "}
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) => handleMouseMove(e, "Jump Rate")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(protocolStats.info.jumpRate).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 },
                        )}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" × ("}
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) => handleMouseMove(e, "Utilization")}
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(
                          protocolStats.info.utilization,
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" - "}
                      <span
                        className={marketDetailsStyles.rate}
                        onMouseMove={(e) =>
                          handleMouseMove(e, "Jump Rate Trigger Utilization")
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        {parseFloat(
                          protocolStats.info.kinkParam,
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {") ≈ "}
                      {protocolStats.borrowAPR.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      {"%"}
                    </>
                  )}
                </p>
              )) || (
                <SkeletonLoading
                  className={styles.value}
                  style={{
                    width: "60px",
                    height: "22.5px",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </div>

          {interestRateModelData && (
            <ResponsiveContainer width="100%" height="100px">
              <LineChart data={interestRateModelData}>
                <YAxis
                  domain={["dataMin", "dataMax + 0.01"]}
                  hide={true}
                />
                <XAxis dataKey="utilization" hide />
                <Line
                  type="monotone"
                  dataKey="apy"
                  stroke="var(--primary-palatinate-blue)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "var(--primary-palatinate-blue)" }}
                />
                <Tooltip content={<></>} cursor={false} />
              </LineChart>
            </ResponsiveContainer>
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

export default MarketDetails;
