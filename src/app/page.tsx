"use client";
import React from "react";
import styles from "./page.module.css";
import Header from "../components/Header/Header";
import ProtocolBalance from "./home/ProtocolBalance/ProtocolBalance";

const Home = () => {
  return (
    <div className={styles.page}>
      <Header home={true} />
      <div className={styles.body}>
        <ProtocolBalance />
      </div>
    </div>
  );
};

export default Home;
