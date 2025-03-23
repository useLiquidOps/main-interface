"use client";
import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "@/components/DropDown/FramerMotion";
import styles from "./ProfileDropDown.module.css";
import ActivityList from "../ActivityList/ActivityList";
import { useTransactions } from "@/hooks/data/useTransactions";
import { SkeletonLoading } from "@/components/SkeletonLoading/SkeletonLoading";

interface ProfileDropdownProps {
  isOpen: boolean;
  address: string;
  isCopied: boolean;
  onCopy: (text: string) => void;
  onLogout: () => void;
  isProfileLoading: boolean;
  profile: {
    thumbnail?: string;
    username?: string;
  };
}

const ProfileDropDown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  address,
  isCopied,
  onCopy,
  onLogout,
  isProfileLoading,
  profile,
}) => {
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 5)}...${addr.slice(-5)}`;

  const { data: transactions, isLoading } = useTransactions();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.dropdown}
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <p className={styles.title}>Profile</p>
          <div className={styles.profileHeader}>
            <div className={styles.profileDetails}>
              <div className={styles.profileImageContainer}>
                {isProfileLoading ? (
                  <SkeletonLoading className="h-full w-full rounded-full" />
                ) : (
                  <img
                    src={
                      profile?.thumbnail
                        ? `https://arweave.net/${profile.thumbnail}`
                        : "/icons/user.svg"
                    }
                    alt="Profile image"
                    width={42}
                    height={42}
                    className={styles.profileImage}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icons/user.svg";
                    }}
                  />
                )}
              </div>
              <div className={styles.profileName}>
                <p className={styles.userName}>
                  {!isProfileLoading && profile?.username
                    ? `${profile.username}`
                    : "Anonymous"}
                </p>
                <div className={styles.addressContainer}>
                  <span>{shortenAddress(address)}</span>
                  <button
                    className={styles.copyButton}
                    onClick={() => onCopy(address)}
                  >
                    <Image
                      src={
                        isCopied ? "/icons/copyActive.svg" : "/icons/copy.svg"
                      }
                      alt="Copy"
                      width={14}
                      height={14}
                    />
                  </button>
                </div>
              </div>
            </div>
            <button className={styles.logoutButton} onClick={onLogout}>
              <Image
                src="/icons/logout.svg"
                alt="logout"
                width={18}
                height={18}
              />
            </button>
          </div>

          <ActivityList
            transactions={transactions ?? []}
            isLoading={isLoading}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropDown;
