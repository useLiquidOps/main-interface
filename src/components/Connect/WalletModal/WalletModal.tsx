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
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnectWander,
  onConnectBeacon,
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
              <p className={styles.modalTitle}>Select wallet</p>
              <button className={styles.closeButton} onClick={onClose}>
                <Image
                  src="/icons/close.svg"
                  height={9}
                  width={9}
                  alt="Close"
                />
              </button>
            </div>

            <div className={styles.walletOptions}>
              <div className={styles.walletOption} onClick={onConnectWander}>
                <Image
                  src="/partners/wander.svg"
                  height={40}
                  width={40}
                  alt="Wander"
                />
                <div className={styles.walletInfo}>
                  <p className={styles.walletName}>Wander</p>
                  <p className={styles.walletDescription}>
                    Chrome based AO/AR wallet.
                  </p>
                </div>
              </div>

              <div className={styles.walletOption} onClick={onConnectBeacon}>
                <Image
                  src="/partners/beacon.svg"
                  height={40}
                  width={40}
                  alt="Beacon"
                />
                <div className={styles.walletInfo}>
                  <p className={styles.walletName}>Beacon</p>
                  <p className={styles.walletDescription}>
                    IOS based AO/AR wallet.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.noWallet}>
              <p className={styles.noWalletTitle}>Don't have a wallet?</p>
              <a
                className={styles.noWalletButton}
                href="https://2hsfyi4t5fiqdcanybdez4e4admrjeqghts22viz7uuo3d5k2nna.arweave.net/0eRcI5PpUQGIDcBGTPCcANkUkgY85a1VGf0o7Y-q01o/#/en/wallets"
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
