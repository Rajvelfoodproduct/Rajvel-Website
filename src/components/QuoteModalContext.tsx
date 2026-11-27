"use client";

import React, { createContext, useContext, useState } from "react";

interface QuoteContextValue {
  isOpen: boolean;
  selectedProduct: string;
  openQuoteModal: (productName?: string) => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteContextValue>({
  isOpen: false,
  selectedProduct: "Semmai — Pure gram flour",
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
});

export function QuoteModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(
    "Semmai — Pure gram flour"
  );

  const openQuoteModal = (productName?: string) => {
    if (productName) {
      setSelectedProduct(productName);
    }
    setIsOpen(true);
  };

  const closeQuoteModal = () => setIsOpen(false);

  return (
    <QuoteModalContext.Provider
      value={{ isOpen, selectedProduct, openQuoteModal, closeQuoteModal }}
    >
      {children}
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  return useContext(QuoteModalContext);
}

