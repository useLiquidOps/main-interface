"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface MenuContextProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextProps>({
  isMenuOpen: false,
  toggleMenu: () => {},
});

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedMenuState = localStorage.getItem("menuState");
    if (storedMenuState !== null) {
      setIsMenuOpen(JSON.parse(storedMenuState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("menuState", JSON.stringify(isMenuOpen));
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
