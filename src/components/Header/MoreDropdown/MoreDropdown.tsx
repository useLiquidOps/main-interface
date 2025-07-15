import React, { useState, useRef } from "react";
import styles from "./MoreDropdown.module.css";
import DropdownButton from "../../DropDown/DropDown";
import Image from "next/image";

interface MoreDropdownProps {
  items: {
    label: string;
    href: string;
  }[];
  label: string;
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({ items, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={styles.moreDropDown}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      ref={dropdownRef}
    >
      <p>{label}</p>
      <DropdownButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className={styles.moreDropdownContent}>
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={styles.moreDropdownItem}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label === "Bridge" && (
                <Image
                  src={"/partners/aox.svg"}
                  alt={`AOX`}
                  width={25}
                  height={25}
                />
              )}
              <p>{item.label}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;
