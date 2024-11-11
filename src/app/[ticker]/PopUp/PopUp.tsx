"use client";
import { createContext, useContext, useState } from "react";

type ModalType = "withdraw" | "repay" | null;

interface ModalContextType {
  modalType: ModalType;
  assetData: any | null;
  openModal: (type: ModalType, data: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [assetData, setAssetData] = useState<any | null>(null);

  const openModal = (type: ModalType, data: any) => {
    setModalType(type);
    setAssetData(data);
  };

  const closeModal = () => {
    setModalType(null);
    setAssetData(null);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, assetData, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
}
