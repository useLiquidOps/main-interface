import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dropdownVariants } from "@/components/DropDown/FramerMotion";
import styles from "./Connect.module.css";
import ActivityList from "../ActivityList/ActivityList";
import { useTransactions } from "@/hooks/data/useTransactions";
import ProfileDetails from "../ProfileDetails/ProfileDetails";

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
    profileId?: string;
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
            <ProfileDetails
              profile={profile}
              isProfileLoading={isProfileLoading}
              address={address}
              isCopied={isCopied}
              onCopy={onCopy}
            />
            <button className={styles.logoutButton} onClick={onLogout}>
              <Image
                src="/icons/logout.svg"
                alt="logout"
                width={18}
                height={18}
              />
            </button>
          </div>

          {/* @ts-ignore, fix transactions activity */}
          <ActivityList transactions={transactions} isLoading={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropDown;
