"use client";
import styles from "./Header.module.css";
import Link from "next/link";

const titleClick = () => {
  window.location.reload();
};

const Header = () => {
  return (
    <header className={styles.header}>
      <button className={styles.pageTitleContainer} onClick={titleClick}>
        <h2 className={styles.pageTitle}>interest</h2>
      </button>
      <div className={styles.navLinks}>
        <Link href="/lend/tAR/deposit">
          <p>Lend</p>
        </Link>
        <Link href="/borrow/tAR/borrow">
          <p>Borrow</p>
        </Link>
        <Link href="/faucet/tAR">
          <p>Faucet</p>
        </Link>
      </div>
      <Link href="/lend/tAR/deposit">
        <button className={styles.appButton}>dApp</button>
      </Link>
    </header>
  );
};

export default Header;
