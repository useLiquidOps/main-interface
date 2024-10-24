"use client";
import React from "react";
import styles from "./home.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";

const Home = ({ params }: { params: { ticker: string; tab: string } }) => {
  const currentToken = params.ticker as string;

  return (
    <div className={styles.page}>
      <Header home={true} currentToken={currentToken} />
      <div className={styles.body}>
        <div className={styles.bodyContainer}>

        <ProtocolBalance />

        </div>
        
      </div>
    </div>
  );
};

export default Home;
