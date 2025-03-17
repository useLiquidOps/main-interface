import styles from "./Spinner.module.css";

const Spinner = ({ size = "18px" }: { size?: string }) => {
  const numericSize = parseInt(size);
  const unit = size.replace(/[0-9]/g, "");

  const style = {
    width: size,
    height: size,
    borderWidth: `${Math.max(1, Math.round(numericSize / 6))}${unit}`,
  };

  return <div className={styles.spinner} style={style}></div>;
};

export default Spinner;
