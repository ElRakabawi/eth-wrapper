'use client'

import React, { createContext, useContext, useState } from 'react';

interface BlobContextType {
  isPending: boolean;
  isSafe: boolean;
  isTransactionComplete: boolean;
  setBlobState: (state: { isPending?: boolean; isSafe?: boolean; isTransactionComplete?: boolean }) => void;
}

const BlobContext = createContext<BlobContextType | undefined>(undefined);

export function BlobProvider({ children }: { children: React.ReactNode }) {
  const [isPending, setIsPending] = useState(false);
  const [isSafe, setIsSafe] = useState(false);
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  const setBlobState = (state: { isPending?: boolean; isSafe?: boolean; isTransactionComplete?: boolean }) => {
    if (state.isPending !== undefined) setIsPending(state.isPending);
    if (state.isSafe !== undefined) setIsSafe(state.isSafe);
    if (state.isTransactionComplete !== undefined) setIsTransactionComplete(state.isTransactionComplete);
  };

  return (
    <BlobContext.Provider value={{ isPending, isSafe, isTransactionComplete, setBlobState }}>
      {children}
    </BlobContext.Provider>
  );
}

export function useBlob() {
  const context = useContext(BlobContext);
  if (context === undefined) {
    throw new Error('useBlob must be used within a BlobProvider');
  }
  return context;
} 