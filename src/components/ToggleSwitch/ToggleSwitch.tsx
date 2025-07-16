import React from "react";
import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  label,
  className = "",
}) => {
  return (
    <div className={`${styles.toggleContainer} ${className}`}>
      <span className={styles.label}>{label}</span>
      <button
        className={`${styles.toggle} ${isOn ? styles.toggleOn : styles.toggleOff}`}
        onClick={onToggle}
        role="switch"
        aria-checked={isOn}
        aria-label={label}
      >
        <div className={styles.toggleSlider}>
          <div className={styles.toggleThumb} />
        </div>
      </button>
    </div>
  );
};

export default ToggleSwitch;
