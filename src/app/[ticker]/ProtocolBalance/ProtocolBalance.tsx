"use client";
import React, { useState } from "react";
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
import { graphDummyData, headerTokensData } from "@/app/data";
import { useProtocolStats } from "@/hooks/data/useProtocolStats";

const ProtocolBalance: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const router = useRouter();
  const { data: protocolStats, isLoading } = useProtocolStats(
    ticker.toUpperCase(),
  );
  const [hoverData, setHoverData] = useState<{
    date: string;
    value: number;
  } | null>(null);

  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase(),
  );

  const handleNavigate = (type: "supply" | "borrow") => {
    router.push(`/${ticker}/${type}`);
  };

  if (!tokenData) {
    return null;
  }

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
              : protocolStats?.protocolBalance?.toLocaleString()}
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
                src={
                  tokenData.percentChange.outcome
                    ? "/icons/APRUp.svg"
                    : "/icons/APRDown.svg"
                }
                alt={
                  tokenData.percentChange.outcome ? "Up Arrow" : "Down Arrow"
                }
                width={0}
                height={16}
                style={{ width: "auto", height: "16px" }}
              />
            )}
            <p className={styles.aprText}>
              {isLoading
                ? "0.00"
                : hoverData
                  ? `${hoverData.value}%`
                  : `${protocolStats?.apr || 0}%`}
            </p>
          </div>
        </div>
        <div className={styles.graph}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphDummyData}
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
