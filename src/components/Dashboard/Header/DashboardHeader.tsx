"use client";
import styles from "./DashboardHeader.module.css";
import ConnectButton from "../ConnectButton/ConnectButton";

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  return (
    <div className={styles.dashboardHeader}>
      <h2 className={styles.title}>{title}</h2>
      <ConnectButton />
    </div>
  );
};

export default DashboardHeader;
