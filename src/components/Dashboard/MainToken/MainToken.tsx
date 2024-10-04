import React from "react";
import styles from "./MainToken.module.css";
import { Token } from "@/utils/ao/utils/tokenInfo";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { PriceData } from "@/utils/ao/getData/getPriceData";

export const handleChartRangeClick = (
  setChartRange: (range: string) => void,
  range: string,
) => {
  setChartRange(range);
};

interface MainTokenProps {
  selectedToken: Token | undefined;
  price: number | undefined;
  priceData: PriceData[];
  chartRange: string;
  setChartRange: React.Dispatch<React.SetStateAction<string>>;
  mainTokenAPY: number | undefined;
}

const MainToken: React.FC<MainTokenProps> = ({
  selectedToken,
  price,
  priceData,
  chartRange,
  setChartRange,
  mainTokenAPY,
}) => {
  return (
    <div className={`${styles.currentToken}`}>
      <div className={styles.tokenHeader}>
        <div className={styles.tokenInfoWrapper}>
          <img
            src={selectedToken?.iconPath}
            alt={selectedToken?.name}
            className={styles.tokenLogo}
          />
          <div className={styles.tokenNameWrapper}>
            <h4 className={styles.tokenAPY}>{mainTokenAPY}% APY</h4>
            <p className={styles.tokenName}>{selectedToken?.name}</p>
            <p className={styles.tokenPrice}>${price} tUSDA</p>
          </div>
        </div>
        <div className={styles.chartRangeSelector}>
          <button
            className={`${styles.chartRangeButton} ${
              chartRange === "1D" ? styles.activeChartRangeButton : ""
            }`}
            onClick={() => handleChartRangeClick(setChartRange, "1D")}
          >
            1D
          </button>
          <button
            className={`${styles.chartRangeButton} ${
              chartRange === "7D" ? styles.activeChartRangeButton : ""
            }`}
            onClick={() => handleChartRangeClick(setChartRange, "7D")}
          >
            7D
          </button>
          <button
            className={`${styles.chartRangeButton} ${
              chartRange === "30D" ? styles.activeChartRangeButton : ""
            }`}
            onClick={() => handleChartRangeClick(setChartRange, "30D")}
          >
            30D
          </button>
        </div>
      </div>
      <div className={styles.priceChartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4844EC"
              strokeWidth={2}
              dot={false}
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainToken;
