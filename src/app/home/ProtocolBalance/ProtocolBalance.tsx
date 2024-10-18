import React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, TooltipProps } from "recharts";
import styles from "./ProtocolBalance.module.css";
import Image from "next/image";

interface DataPoint {
  date: string;
  value: number;
}

const dummyData: DataPoint[] = [
  { date: '2023-10-01', value: 3 },
  { date: '2023-10-02', value: 1 },
  { date: '2023-10-03', value: 2 },
  { date: '2023-10-04', value: 3 },
  { date: '2023-10-05', value: 4 },
  { date: '2023-10-06', value: 3.5 },
  { date: '2023-10-07', value: 4.5 },
  { date: '2023-10-08', value: 4 },
  { date: '2023-10-09', value: 3.5 },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
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
  return (
    <div className={styles.protocolBalance}>
      <div className={styles.mainContent}>
        <h2 className={styles.title}>Protocol balance</h2>
        <div className={styles.balance}>
          <div className={styles.balanceIcon}>
            <Image src="/tokens/qAR.svg" alt="qAR Token" width={50} height={50} />
          </div>
          <span className={styles.amount}>3,745.62</span>
          <span className={styles.currency}>qAR</span>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.supplyButton}`}>
            <Image src="/icons/plus.svg" alt="Plus" width={16} height={16} />
            <span>Supply assets</span>
          </button>
          <button className={`${styles.button} ${styles.borrowButton}`}>
            <span>Borrow assets</span>
            <Image src="/icons/bank.svg" alt="Borrow" width={16} height={16} />
          </button>
        </div>
      </div>
      <div className={styles.aprSection}>
        <div className={styles.aprContainer}>
          <span className={styles.aprLabel}>APR</span>
          <div className={styles.aprValue}>
            <Image src="/icons/APRUp.svg" alt="Up Arrow" width={15} height={15} />
            <span>4.57%</span>
          </div>
        </div>
        <div className={styles.graph}>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={dummyData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--secondary-slate-blue)"
                strokeWidth={2}
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