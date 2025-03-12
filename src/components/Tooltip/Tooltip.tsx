import React, { useState } from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  text: string;
  fontSize: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, fontSize, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.tooltipContainer}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={styles.tooltip} style={{ fontSize }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
