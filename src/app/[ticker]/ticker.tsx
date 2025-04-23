"use client";
import React from "react";
import styles from "./ticker.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";
import Market from "./Market/Market";
import PositionSummary from "./PositionSummary/PositionSummary";
import { tokens } from "liquidops";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import BetaDisclaimer from "@/components/BetaDisclaimer/BetaDisclaimer";

const Ticker = ({ params }: { params: { ticker: string; tab: string } }) => {
  const ticker = params.ticker as string;

  const tokenTickers = Object.keys(tokens);

  if (!tokenTickers.includes(ticker.toUpperCase())) {
    redirect("/404");
  }

  return (
    <div className={styles.page}>
      <BetaDisclaimer />
      <Header mode="ticker" currentToken={ticker} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>
          <ProtocolBalance ticker={ticker} />
          <div className={styles.grid}>
            <Market ticker={ticker} />
            <PositionSummary ticker={ticker} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Ticker;
