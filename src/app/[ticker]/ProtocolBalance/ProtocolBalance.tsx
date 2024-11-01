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
import { useParams } from "next/navigation";

interface DataPoint {
  date: string;
  value: number;
}

const dummyData: DataPoint[] = [
  { date: "2023-10-01", value: 4 },
  { date: "2023-10-02", value: 3.9 },
  { date: "2023-10-02", value: 3.9 },
  { date: "2023-10-02", value: 3.8 },
  { date: "2023-10-03", value: 3 },
  { date: "2023-10-04", value: 2.0 },
  { date: "2023-10-05", value: 2.5 },
  { date: "2023-10-05", value: 2.5 },
  { date: "2023-10-06", value: 3.0 },
  { date: "2023-10-07", value: 3.5 },
  { date: "2023-10-07", value: 3.5 },
  { date: "2023-10-08", value: 4.2 },
  { date: "2023-10-09", value: 3.8 },
  { date: "2023-10-10", value: 4.2 },
  { date: "2023-10-11", value: 4.0 },
  { date: "2023-10-12", value: 3.5 },
];

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

const ProtocolBalance: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const ticker = params.ticker as string;

  const handleNavigate = (type: "supply" | "borrow") => {
    router.push(`/${ticker}/${type}`);
  };

  return (
    <div className={styles.protocolBalance}>
      <div className={styles.mainContent}>
        <h2 className={styles.title}>Protocol balance</h2>
        <div className={styles.balance}>
          <div className={styles.balanceIcon}>
            <Image
              src="/tokens/qAR.svg"
              alt="qAR Token"
              width={50}
              height={50}
            />
          </div>
          <p className={styles.amount}>3,745.62</p>
          <p className={styles.currency}>qAR</p>
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
              src="/icons/APRUp.svg"
              alt="Up Arrow"
              width={0}
              height={16}
              style={{ width: "auto", height: "16px" }}
            />
            <p className={styles.aprText}>4.57%</p>
          </div>
        </div>
        <div className={styles.graph}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dummyData}
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

export default ProtocolBalance;
