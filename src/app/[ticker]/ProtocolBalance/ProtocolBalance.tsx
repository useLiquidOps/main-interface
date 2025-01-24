"use client";
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./ProtocolBalance.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSupportedTokens } from "@/hooks/data/useSupportedTokens";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";
import { useHistoricalAPR } from "@/hooks/data/useHistoricalAPR";
import { Quantity } from "ao-tokens";
import { formatTMB } from "@/components/utils/utils";

const ProtocolBalance: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const router = useRouter();
  const { data: protocolStats, isLoading } = useProtocolStats(
    ticker.toUpperCase(),
  );
  const { data: historicalData, isLoading: isLoadingHistorical } =
    useHistoricalAPR(ticker.toUpperCase());
  const [hoverData, setHoverData] = useState<{
    date: string;
    value: number;
  } | null>(null);

  const { data: supportedTokens = [] } = useSupportedTokens();
  const tokenData = supportedTokens.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const processedHistoricalData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) return [];
    if (historicalData.length > 1) return historicalData;

    const result = [];
    const today = new Date();

    // Add 6 days of zero values
    for (let i = 6; i > 0; i--) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      const dateStr = pastDate.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        value: 0,
      });
    }

    // Add the current data point
    result.push(historicalData[0]);

    return result;
  }, [historicalData]);

  const handleNavigate = (type: "supply" | "borrow") => {
    router.push(`/${ticker}/${type}`);
  };

  if (!tokenData) return null;

  const getOutcomeIcon = () => {
    if (!protocolStats || protocolStats.apr === 0) {
      return "/icons/APRUp.svg";
    }
    return protocolStats.percentChange.outcome
      ? "/icons/APRUp.svg"
      : "/icons/APRDown.svg";
  };

  return (
    <div className={styles.protocolBalance}>
      <div className={styles.mainContent}>
        <h2 className={styles.title}>Protocol balance</h2>
        <div className={styles.balance}>
          <div className={styles.balanceIcon}>
            <Image
              src={`/tokens/${ticker.toLowerCase()}.svg`}
              alt={`${tokenData.name} Token`}
              width={50}
              height={50}
            />
          </div>
          <p className={styles.amount}>
            {isLoading
              ? "0.00"
              : formatTMB(
                  new Quantity(
                    protocolStats?.protocolBalance,
                    protocolStats?.denomination,
                  ),
                )}
          </p>
          <p className={styles.currency}>{tokenData.ticker}</p>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.supplyButton}`}
            onClick={() => handleNavigate("supply")}
          >
            <span>Supply assets</span>
            <Image src="/icons/plus.svg" alt="Plus" width={16} height={16} />
          </button>
          <button
            className={`${styles.button} ${styles.borrowButton}`}
            onClick={() => handleNavigate("borrow")}
          >
            <span>Borrow assets</span>
            <Image src="/icons/bank.svg" alt="Borrow" width={16} height={16} />
          </button>
        </div>
      </div>
      <div className={styles.aprSection}>
        <div className={styles.aprContainer}>
          <p className={styles.aprLabel}>
            {hoverData ? hoverData.date : "APR"}
          </p>
          <div className={styles.aprValue}>
            {!hoverData && (
              <Image
                src={getOutcomeIcon()}
                alt={
                  protocolStats?.percentChange.outcome
                    ? "Up Arrow"
                    : "Down Arrow"
                }
                width={0}
                height={16}
                style={{ width: "auto", height: "16px" }}
              />
            )}
            <p className={styles.aprText}>
              {isLoadingHistorical || !protocolStats
                ? "0.00%"
                : hoverData
                  ? `${hoverData.value.toFixed(2)}%`
                  : `${protocolStats.apr.toFixed(2)}%`}
            </p>
          </div>
        </div>
        <div className={styles.graph}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedHistoricalData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              onMouseMove={(data) => {
                if (data.activePayload) {
                  setHoverData({
                    date: data.activeLabel as string,
                    value: data.activePayload[0].value as number,
                  });
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
              <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} hide={true} />
              <XAxis dataKey="date" hide />
              <Line
                type="linear"
                dataKey="value"
                stroke="var(--secondary-slate-blue)"
                strokeWidth={3}
                dot={false}
              />
              <Tooltip content={<></>} cursor={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProtocolBalance;
