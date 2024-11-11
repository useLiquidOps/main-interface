import React from "react";
import styles from "./DropDown.module.css";
import Image from "next/image";

interface DropdownButtonProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      className={`${styles.dropdownButton} ${isOpen ? styles.open : ""}`}
      onClick={onToggle}
    >
      <Image
        src="/icons/dropdown.svg"
        alt="Dropdown"
        width={10}
        height={5}
        className={styles.dropdownIcon}
      />
    </button>
  );
};

export default DropdownButton;
