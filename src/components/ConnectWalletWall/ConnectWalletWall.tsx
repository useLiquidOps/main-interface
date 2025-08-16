"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import styles from "./ConnectWalletWall.module.css";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";
import { checkConnection } from "@/utils/Wallets/checkConnection";
import { useHighestAPY } from "@/hooks/LiquidOpsData/useHighestAPY";
import Header from "../Header/Header";

interface ConnectWalletWallProps {
  children: ReactNode;
  customMessage?: string;
  showAPY?: boolean;
}

const ConnectWalletWall: React.FC<ConnectWalletWallProps> = ({
  children,
  customMessage = "Please connect your wallet",
  showAPY = true,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [triggerConnect, setTriggerConnect] = useState(false);

  const { data: highestAPYData, isLoading: isApyLoading } = useHighestAPY();

  const highestAPY = highestAPYData?.highestAPY;
  const highestTicker = highestAPYData?.highestTicker;

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const connected = await checkConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setIsConnected(false);
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkWalletConnection();

    // Check connection status periodically
    const interval = setInterval(async () => {
      try {
        const connected = await checkConnection();
        setIsConnected(connected);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        setIsConnected(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleWalletConnected = () => {
    setIsConnected(true);
    setIsCheckingConnection(false);
  };

  const handleConnectClick = () => {
    setTriggerConnect(true);
    setTimeout(() => setTriggerConnect(false), 100);
  };

  // Show nothing while checking connection initially
  if (isCheckingConnection) {
    return (
      <>
        <Header
          triggerConnect={triggerConnect}
          onWalletConnected={handleWalletConnected}
        />
        {/* You can add a loading spinner here if desired */}
      </>
    );
  }

  // If connected, render the children
  if (isConnected) {
    return (
      <>
        <Header
          triggerConnect={triggerConnect}
          onWalletConnected={handleWalletConnected}
        />
        {children}
      </>
    );
  }

  // If not connected, show the connect wall
  return (
    <>
      <Header
        triggerConnect={triggerConnect}
        onWalletConnected={handleWalletConnected}
      />
      <div className={styles.connectPrompt}>
        <p className={styles.connectWalletTitle}>{customMessage}</p>

        {showAPY && (
          <div className={styles.highestAPY}>
            <div className={styles.highestAPYText}>
              <span>Supplying liquidity can earn you up to</span>
              {isApyLoading ||
              highestAPY === undefined ||
              highestAPY === null ? (
                <SkeletonLoading style={{ width: "60px", height: "13px" }} />
              ) : (
                <Link className={styles.apyNumber} href={`/${highestTicker}`}>
                  {highestAPY.toFixed(2)}% APY
                </Link>
              )}
            </div>
          </div>
        )}

        <button className={styles.connectButton} onClick={handleConnectClick}>
          Login
        </button>
      </div>
    </>
  );
};

export default ConnectWalletWall;
