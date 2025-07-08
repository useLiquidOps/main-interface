"use client";
import React from "react";
import styles from "./WalletModal.module.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  overlayVariants,
  dropdownVariants,
} from "@/components/DropDown/FramerMotion";
import Image from "next/image";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectWander: () => void;
  onConnectBeacon: () => void;
  onConnectOuro: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnectWander,
  onConnectBeacon,
  onConnectOuro,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>Select AR/AO wallet</p>
              <button className={styles.closeButton} onClick={onClose}>
                <Image
                  src="/icons/close-icon.svg"
                  height={9}
                  width={9}
                  alt="Close"
                />
              </button>
            </div>

            <div className={styles.walletOptions}>
              <div
                className={styles.walletOption}
                style={{ backgroundColor: "#6b57f9" }}
                onClick={onConnectWander}
              >
                <Image
                  src="/partners/wander.svg"
                  height={40}
                  width={40}
                  alt="Wander"
                />
                <div className={styles.walletInfo}>
                  <p className={styles.walletName}>Wander</p>
                  <p className={styles.walletDescription}>
                    Chrome/IOS/Android support
                  </p>
                </div>
              </div>

              <div
                className={styles.walletOption}
                style={{ backgroundColor: "#1D2BC2" }}
                onClick={onConnectBeacon}
              >
                <Image
                  src="/partners/beacon.svg"
                  height={40}
                  width={40}
                  alt="Beacon"
                  style={{ border: "1px solid white", borderRadius: "12px" }}
                />
                <div className={styles.walletInfo}>
                  <p className={styles.walletName}>Beacon</p>
                  <p className={styles.walletDescription}>IOS support</p>
                </div>
              </div>

              <div
                className={styles.walletOption}
                style={{ backgroundColor: "#bbfba9" }}
                onClick={onConnectOuro}
              >
                <Image
                  src="/partners/ouro.png"
                  height={40}
                  width={40}
                  alt="Ouro"
                />
                <div className={styles.walletInfo}>
                  <p className={styles.walletName} style={{ color: "black" }}>
                    Ouro
                  </p>
                  <p
                    className={styles.walletDescription}
                    style={{ color: "black" }}
                  >
                    Chrome support
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.noWallet}>
              <p className={styles.noWalletTitle}>Don't have a AR/AO wallet?</p>
              <a
                className={styles.noWalletButton}
                href="https://www.wander.app/"
                target="_blank"
              >
                Get wallet
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;
