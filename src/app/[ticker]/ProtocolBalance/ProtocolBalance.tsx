import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";
import styles from "./ProtocolBalance.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { graphDummyData, headerTokensData } from "@/app/data";

const ProtocolBalance: React.FC<{
  ticker: string;
}> = ({ ticker }) => {
  const router = useRouter();
  
  const tokenData = headerTokensData.find(
    (token) => token.ticker.toLowerCase() === ticker.toLowerCase()
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
          <p className={styles.amount}>3,745.62</p>
          <p className={styles.currency}>{ticker}</p>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.supplyButton}`}
            onClick={() => handleNavigate("supply")}
          >
            <Image src="/icons/plus.svg" alt="Plus" width={16} height={16} />
            <span>Supply assets</span>
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
          <p className={styles.aprLabel}>APR</p>
          <div className={styles.aprValue}>
            <Image
              src={tokenData.percentChange.outcome ? "/icons/APRUp.svg" : "/icons/APRDown.svg"}
              alt={tokenData.percentChange.outcome ? "Up Arrow" : "Down Arrow"}
              width={0}
              height={16}
              style={{ width: "auto", height: "16px" }}
            />
            <p className={styles.aprText}>{tokenData.APR}%</p>
          </div>
        </div>
        <div className={styles.graph}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphDummyData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} hide={true} />
              <XAxis dataKey="date" hide />
              <Line
                type="linear"
                dataKey="value"
                stroke="var(--secondary-slate-blue)"
                strokeWidth={3}
                dot={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
                position={{ y: -40 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>{label}</p>
        <p className={styles.tooltipValue}>{`APR : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default ProtocolBalance;