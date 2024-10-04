"use client";
import React from "react";
import styles from "./Menu.module.css";
import Link from "next/link";
import { useMenu } from "./MenuContext";
import { usePathname } from "next/navigation";

const MenuToggle: React.FC = () => {
  const { isMenuOpen, toggleMenu } = useMenu();
  const pathname = usePathname();
  const isLendingPage = pathname.startsWith("/lend");
  const isBorrowingPage = pathname.startsWith("/borrow");
  const isFaucetPage = pathname.startsWith("/faucet");

  return (
    <div className={`${styles.leftMenu} ${isMenuOpen ? "" : styles.closed}`}>
      <div className={styles.menuContent}>
        <Link href="/" className={styles.titleContainerLink}>
          <div className={styles.titleContainer}>
            <img
              src={
                isMenuOpen
                  ? "/images/landingFullIcon.svg"
                  : "/images/landingFavicon.svg"
              }
              alt="Favicon"
              height="20"
              className={styles.titleImage}
            />
          </div>
        </Link>
        <ul className={styles.menuList}>
          <Link href="/lend/tAR/deposit" className={styles.menuItemLink}>
            <li
              className={`${styles.menuItem} ${isLendingPage ? styles.active : ""}`}
            >
              <img src="/images/lend.svg" alt="Lend" height="20" />
              {isMenuOpen && <span className={styles.menuItemText}>Lend</span>}
            </li>
          </Link>
          <Link href="/borrow/tAR/borrow" className={styles.menuItemLink}>
            <li
              className={`${styles.menuItem} ${isBorrowingPage ? styles.active : ""}`}
            >
              <img src="/images/borrow.svg" alt="Borrow" height="20" />
              {isMenuOpen && (
                <span className={styles.menuItemText}>Borrow</span>
              )}
            </li>
          </Link>
          <Link href="/faucet/tAR" className={styles.menuItemLink}>
            <li
              className={`${styles.menuItem} ${isFaucetPage ? styles.active : ""}`}
            >
              <img src="/images/faucet.svg" alt="Faucet" height="20" />
              {isMenuOpen && (
                <span className={styles.menuItemText}>Faucet</span>
              )}
            </li>
          </Link>
        </ul>
      </div>
      <div className={styles.bottomContainer}>
        <div
          className={`${styles.toggleButtonContainer} ${isMenuOpen ? styles.openMenu : ""}`}
        >
          <button className={styles.toggleButton} onClick={toggleMenu}>
            {isMenuOpen ? (
              <img src="/icons/arrow-left.svg" alt="Close" />
            ) : (
              <img src="/icons/arrow-right.svg" alt="Open" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuToggle;
