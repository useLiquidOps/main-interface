import React, { createContext, useState, useContext, ReactNode } from "react";

interface AccountTabContextType {
  isOpen: boolean;
  setAccountTab: (isOpen: boolean) => void;
}

const AccountTabContext = createContext<AccountTabContextType | undefined>(
  undefined,
);

export const AccountTabProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const setAccountTab = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <AccountTabContext.Provider value={{ isOpen, setAccountTab }}>
      {children}
    </AccountTabContext.Provider>
  );
};

export const useAccountTab = (): AccountTabContextType => {
  const context = useContext(AccountTabContext);
  if (context === undefined) {
    throw new Error("useAccountTab must be used within an AccountTabProvider");
  }
  return context;
};
