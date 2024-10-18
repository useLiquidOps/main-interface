"use client";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Connect from "../Connect/Connect";

const titleClick = () => {
  window.location.reload();
};

const Header = () => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.pageTitleContainer} onClick={titleClick}>
          <Image
            src="/favicon.svg"
            alt="LiquidOps Logo"
            width={30}
            height={30}
            className={styles.favicon}
          />
          <h2 className={styles.pageTitle}>LiquidOps</h2>
        </button>

        <nav className={styles.navLinks}>
          <Link
            href="/"
            className={activeLink === "/" ? styles.activeLink : ""}
          >
            <p>Home</p>
          </Link>
          <Link
            href="/markets"
            className={activeLink === "/markets" ? styles.activeLink : ""}
          >
            <p>Markets</p>
          </Link>
          <Link
            href="/liquidations"
            className={activeLink === "/liquidations" ? styles.activeLink : ""}
          >
            <p>Liquidations</p>
          </Link>
          <Link
            href="/faucet"
            className={activeLink === "/faucet" ? styles.activeLink : ""}
          >
            <p>Faucet</p>
          </Link>
        </nav>
      </div>
      <Connect />
    </header>
  );
};

export default Header;
