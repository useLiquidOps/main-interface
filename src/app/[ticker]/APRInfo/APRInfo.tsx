import styles from "./APRInfo.module.css";
import { useDeLaPoolData } from "@/hooks/data/useDeLaPoolData";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useProtocolStats } from "@/hooks/LiquidOpsData/useProtocolStats";
import { useHistoricalAPR } from "@/hooks/LiquidOpsData/useHistoricalAPR";

interface PoolDataItem {
  timestamp: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: null;
  il7d: null;
  apyBase7d: null;
}

interface ChartDataItem {
  date: string;
  supplyAPY: number;
  borrowAPR: number;
  timestamp: string;
}

interface HoverDataType {
  date: string;
  supplyAPY: number;
  borrowAPR: number;
  timestamp: string;
}

interface HistoricalDataItem {
  date: string;
  value: number;
}

const APRInfo: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const { data: poolGraphData } = useDeLaPoolData(ticker);
  const { data: protocolStats } = useProtocolStats(ticker.toUpperCase());
  const { data: historicalData, isLoading: isLoadingHistorical } =
    useHistoricalAPR(ticker.toUpperCase());

  const [hoverData, setHoverData] = useState<HoverDataType | null>(null);

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAPY = (value: number): string => {
    return value ? value.toFixed(2) : "0.00";
  };

  const processedData = useMemo(() => {
    if (!poolGraphData || !poolGraphData.data) return [];

    const uniqueDates = historicalData
      ? [
          ...new Set(
            historicalData.map((item: HistoricalDataItem) => item.date),
          ),
        ].sort()
      : [];

    const borrowRatesByDate: Record<string, number> = {};
    if (historicalData) {
      uniqueDates.forEach((date) => {
        const pointsForDate = historicalData.filter(
          (item: HistoricalDataItem) => item.date === date,
        );
        borrowRatesByDate[date] = pointsForDate[pointsForDate.length - 1].value;
      });
    }

    return poolGraphData.data.map((item: PoolDataItem): ChartDataItem => {
      const dateObj = new Date(item.timestamp);
      const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")}/${dateObj.getFullYear()}`;

      const borrowAPR = borrowRatesByDate[formattedDate];

      return {
        date: dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        supplyAPY: item.apy,
        borrowAPR: borrowAPR,
        timestamp: item.timestamp,
      };
    });
  }, [poolGraphData, historicalData, protocolStats]);

  return (
    <div className={styles.container}>
      <div className={styles.utilizationContainer}>
        <div className={styles.circleChartContainer}>
          {protocolStats?.protocolBalance && protocolStats?.borrows ? (
            <>
              <svg className={styles.circleChart} viewBox="0 0 120 120">
                <circle
                  className={styles.circleChartBg}
                  cx="60"
                  cy="60"
                  r="50"
                />
                <circle
                  className={styles.circleChartProgress}
                  cx="60"
                  cy="60"
                  r="50"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 50}`,
                    strokeDashoffset: `${
                      2 *
                      Math.PI *
                      50 *
                      (1 -
                        // @ts-ignore
                        (protocolStats?.borrows ?? 0) /
                          // @ts-ignore
                          (protocolStats?.protocolBalance ?? 1))
                    }`,
                  }}
                />
              </svg>
              <div className={styles.utilizationPercentage}>
                {(
                  (Number(protocolStats.borrows) /
                    Number(protocolStats.protocolBalance)) *
                  100
                ).toFixed(2) + "%"}
              </div>
              <p className={styles.utilizationLabel}>Utilization</p>
            </>
          ) : (
            <SkeletonLoading
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.APRInfo}>
        <p className={styles.title}>
          {hoverData ? formatDate(hoverData.timestamp) : "APY details"}
        </p>
        <div className={styles.graph}>
          {!poolGraphData || isLoadingHistorical ? (
            <SkeletonLoading
              style={{ width: "100%", height: "100%", borderRadius: "8px" }}
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processedData}
                onMouseMove={(data) => {
                  if (data.activePayload && data.activePayload[0]) {
                    setHoverData(
                      data.activePayload[0].payload as HoverDataType,
                    );
                  }
                }}
                onMouseLeave={() => setHoverData(null)}
              >
                <defs>
                  <linearGradient
                    id="graphBackground"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#F6F6FE" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#graphBackground)"
                />
                <YAxis
                  domain={["dataMin - 0.01", "dataMax + 0.01"]}
                  hide={true}
                />
                <XAxis dataKey="date" hide />
                <Line
                  type="monotone"
                  dataKey="supplyAPY"
                  stroke="var(--APY-green)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "var(--APY-green)" }}
                />
                <Line
                  type="monotone"
                  dataKey="borrowAPR"
                  stroke="var(--APY-red)"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "var(--APY-red)" }}
                />
                <Tooltip content={<></>} cursor={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div
          className={styles.infoContainer}
          style={{ width: "100%", justifyContent: "flex-end" }}
        >
          <div className={styles.infoTextContainer}>
            <div className={styles.apyContainer}>
              <Image
                src={"/icons/APYStars.svg"}
                alt={"Up arrow"}
                width={13}
                height={13}
              />
              <p className={styles.infoValue}>
                {!protocolStats?.supplyAPR && !hoverData?.supplyAPY ? (
                  <SkeletonLoading
                    className={styles.aprText}
                    style={{ width: "40px", height: "16px" }}
                  />
                ) : (
                  formatAPY(
                    // @ts-ignore
                    hoverData ? hoverData.supplyAPY : protocolStats?.supplyAPR,
                  ) + "%"
                )}
              </p>
            </div>
            <p className={styles.infoTitle}>Supply APR</p>
          </div>
          <div className={styles.infoTextContainer}>
            <div className={styles.apyContainer}>
              <Image
                src={"/icons/APRStars.svg"}
                alt={"Down arrow"}
                width={13}
                height={13}
              />
              <p className={styles.infoValue}>
                {!protocolStats?.borrowAPR && !hoverData?.borrowAPR ? (
                  <SkeletonLoading
                    className={styles.aprText}
                    style={{ width: "40px", height: "16px" }}
                  />
                ) : (
                  formatAPY(
                    // @ts-ignore
                    hoverData ? hoverData.borrowAPR : protocolStats?.borrowAPR,
                  ) + "%"
                )}
              </p>
            </div>
            <p className={styles.infoTitle}>Borrow APR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APRInfo;
