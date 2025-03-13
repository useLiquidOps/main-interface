import React, { useState, useRef } from "react";
import styles from "./MoreDropdown.module.css";
import DropdownButton from "../../DropDown/DropDown";

interface MoreDropdownProps {
  items: {
    label: string;
    href: string;
  }[];
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={styles.moreDropDown}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      ref={dropdownRef}
    >
      <p>More</p>
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
              <p>{item.label}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoreDropdown;
