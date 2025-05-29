import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import styles from "../PositionSummary/PositionSummary.module.css";
import marketDetailsStyles from "./MarketDetails.module.css";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Quantity } from "ao-tokens";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

  const interestModel = useMemo(
    () => {
      if (!protocolStats) return undefined;
      return {
        kinkParam: parseFloat(protocolStats.info.kinkParam),
        baseRate: parseFloat(protocolStats.info.baseRate),
        jumpRate: parseFloat(protocolStats.info.jumpRate),
        initRate: parseFloat(protocolStats.info.initRate),
      };
    },
    [protocolStats]
  );

  const [hoveredUtilization, setHoveredUtilization] = useState<number | undefined>();
  const hoveredAPY = useMemo(() => {
    if (!hoveredUtilization || !interestModel) return undefined;

    const {
      initRate,
      kinkParam,
      baseRate,
      jumpRate
    } = interestModel;
    let apy = initRate;

    if (hoveredUtilization <= kinkParam) {
      apy += hoveredUtilization * baseRate / 100;
    } else {
      apy += kinkParam * baseRate / 100 + (hoveredUtilization - kinkParam) * jumpRate / 100;
    }

    return apy;
  }, [hoveredUtilization]);

  const interestRateModelData = useMemo(() => {
    if (!interestModel) return undefined;

    const {
      initRate,
      kinkParam,
      baseRate,
      jumpRate
    } = interestModel;
    const data = [];

    for (let u = 0; u <= 100; u++) {
      let apy = initRate;

      if (u <= kinkParam) {
        apy += u * baseRate / 100;
      } else {
        apy += kinkParam * baseRate / 100 + (u - kinkParam) * jumpRate / 100;
      }

      data.push({ apy, utilization: u });
    }

    return data;
  }, [interestModel]);

  const referenceUtilization = useMemo(() => {
    if (!protocolStats?.info?.utilization) return undefined;
    return parseInt(protocolStats.info.utilization);
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
                  {(!jumpRateActive && (!hoveredUtilization || hoveredUtilization <= parseFloat(protocolStats.info.kinkParam)) && (
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
                        {(hoveredUtilization || protocolStats.utilizationRate).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className={marketDetailsStyles.percentage}>%</span>
                      {" ≈ "}
                      {(hoveredAPY || protocolStats.borrowAPR).toLocaleString(undefined, {
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
                        {(hoveredUtilization || protocolStats.utilizationRate).toLocaleString(undefined, {
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
                      {(hoveredAPY || protocolStats.borrowAPR).toLocaleString(undefined, {
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

          <div className={marketDetailsStyles.interestRateChart}>
            {interestRateModelData && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={interestRateModelData}
                  onMouseMove={(e) => setHoveredUtilization(e.activeTooltipIndex)}
                  onMouseLeave={() => setHoveredUtilization(undefined)}
                  margin={{ bottom: 0, left: 0, right: 0 }}
                >
                  <YAxis domain={["dataMin", "dataMax"]} hide />
                  <XAxis
                    dataKey="utilization"
                    ticks={[0, ...([referenceUtilization, hoveredUtilization].filter(v => !!v).sort()), , 100] as number[]}
                    tickFormatter={(v) => {
                      if (v === hoveredUtilization) {
                        return "Utilization: " + v.toString() + "%"
                      }
                      if (v === referenceUtilization) {
                        return (protocolStats?.utilizationRate?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || referenceUtilization) + "%";
                      }

                      return v;
                    }}
                    fontSize={10}
                    interval="preserveStartEnd"
                  />
                  <CartesianGrid vertical={false} opacity={.34} />
                  <Tooltip
                    content={<></>}
                  />
                  <Line
                    type="monotone"
                    dataKey="apy"
                    stroke="var(--secondary-periwinkle)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "var(--primary-palatinate-blue)" }}
                  />
                  {referenceUtilization && (
                    <>
                      <ReferenceLine
                        x={referenceUtilization}
                        stroke="var(--primary-ultramarine)"
                      />
                      <ReferenceDot
                        x={referenceUtilization}
                        y={interestRateModelData[referenceUtilization].apy}
                        r={4}
                        fill="var(--primary-palatinate-blue)"
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
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

export default MarketDetails;
