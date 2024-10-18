"use client";
import styles from "./page.module.css";
import Header from "../components/Header/Header";

const Home = () => {
  return (
    <div className={styles.page}>
      <Header home={true} />
      <div className={styles.body}>home</div>
    </div>
  );
};

export default Home;
