"use client";
import React from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import Header from "../../components/Header/Header";
import ProtocolBalance from "./ProtocolBalance/ProtocolBalance";

const Home = () => {
  const params = useParams();
  const currentToken = params.ticker as string;

  return (
    <div className={styles.page}>
      <Header home={true} currentToken={currentToken} />
      <div className={styles.body}>
        <ProtocolBalance />
      </div>
    </div>
  );
};

export default Home;