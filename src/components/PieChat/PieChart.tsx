import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./PieChart.module.css";

export interface PieChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartDataItem[];
  height?: number;
  colors?: string[];
  tooltipFormatter?: (
    item: PieChartDataItem,
    totalValue: number,
  ) => React.ReactNode;
  className?: string;
}

const DEFAULT_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6B6B",
  "#82CA9D",
  "#FFC658",
];

const CustomTooltip = (props: any) => {
  const { active, payload, totalValue, customFormatter } = props;

  if (active && payload && payload.length > 0) {
    const data = payload[0].payload as PieChartDataItem;
    const total = totalValue || 0;

    if (customFormatter) {
      return customFormatter(data, total);
    }

    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipName}>{data.name}</p>
        <p className={styles.tooltipValue}>
          Amount:{" "}
          {data.value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className={styles.tooltipPercentage}>
          Percentage: {((data.value / total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  colors = DEFAULT_COLORS,
  tooltipFormatter,
  className,
}) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className={`${styles.container} ${className || ""}`}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="90%"
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={false}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                totalValue={totalValue}
                customFormatter={tooltipFormatter}
              />
            }
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
