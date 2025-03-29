'use client'

import React, { useEffect, useMemo } from 'react';
import { useSafe, createConfig } from '@safe-global/safe-react-hooks';
import { sepolia } from 'wagmi/chains';
import { useAccount } from 'wagmi';
import { ethAddress } from 'viem';
import { toast } from 'sonner';
import { SEPOLIA_SCAN_URL } from '../../constants';
import { SafeTransactionResponse } from '../../types';

const LAST_PENDING_TX_KEY = 'lastPendingSafeTx';

interface SafeTxTrackerProps {
  onPendingTxChange?: (hasPendingTx: boolean) => void;
}

const SafeTxTracker: React.FC<SafeTxTrackerProps> = ({ onPendingTxChange }) => {
  const { address } = useAccount();
  const config = useMemo(() => createConfig({
    chain: sepolia,
    safeAddress: address,
    signer: ethAddress, // dummy signer for read-only provider
    provider: sepolia.rpcUrls.default.http[0],
  }), [address]);
  
  const { getPendingTransactions, getTransactions } = useSafe();
  const { data: pendingTxs, refetch: refetchPendingTxs, isLoading: isLoadingPending} = getPendingTransactions({ config });
  const { data: transactions, refetch: refetchTransactions } = getTransactions({ config });
  // last safe pending transaction that is orignated from EthWrapper
  const pendingTx = pendingTxs?.find(tx => {
    const safeTx = tx as SafeTransactionResponse;
    return JSON.parse(safeTx?.origin || '{}').name === "EthWrapper";
  });

  // fire the onPendingTxChange callback when the pending transaction changes
  // this is used to update the state of the Wrap component
  useEffect(() => {
    onPendingTxChange?.(!!pendingTx);
  }, [pendingTx, onPendingTxChange]);

  // save the last pending transaction hash to local storage
  useEffect(() => {
    if (pendingTx?.safeTxHash) {
      const lastPendingTxHash = localStorage.getItem(LAST_PENDING_TX_KEY);
      if (lastPendingTxHash !== pendingTx.safeTxHash) {
        localStorage.setItem(LAST_PENDING_TX_KEY, pendingTx.safeTxHash);
      }
    }
  }, [pendingTx?.safeTxHash]);

  // check if the transaction is completed
  useEffect(() => {
    const lastPendingTxHash = localStorage.getItem(LAST_PENDING_TX_KEY);
    if (lastPendingTxHash && transactions) {
      const completedTx = transactions.find(tx => {
        const safeTx = tx as SafeTransactionResponse;
        return safeTx.safeTxHash === lastPendingTxHash;
      }) as SafeTransactionResponse | undefined;
      
      // if the transaction is completed, show a success toast
      if (completedTx?.transactionHash) {
        toast.success('Transaction completed successfully', {
          action: {
            label: 'View on Etherscan',
            onClick: () => window.open(`${SEPOLIA_SCAN_URL}/tx/${completedTx.transactionHash}`, '_blank'),
          },
        });
        // remove the last pending transaction hash from local storage
        localStorage.removeItem(LAST_PENDING_TX_KEY);
      }
    }
  }, [transactions]);

  // pending and completed transactions status polling
  useEffect(() => {
    const interval = setInterval(() => {
      refetchPendingTxs();
      refetchTransactions();
    }, 1000);

    return () => clearInterval(interval);
  }, [refetchPendingTxs, refetchTransactions]);

  if (isLoadingPending) {
    return (
      <div className="bg-neutral-800 rounded-xl p-4 mt-4 font-[family-name:var(--font-geist-mono)] tracking-tighter">
        <div className="flex justify-between items-center">
          <div className="text-[#12ff80] font-medium text-sm">Multi-signature Status</div>
          <div className="flex items-center gap-2">
            <div className="animate-spin h-3 w-3 border-[1.5px] border-neutral-400 border-t-transparent rounded-full"></div>
            <span className="text-neutral-400 text-xs">Loading Transactions..</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>
    );
  }

  if (!pendingTx) {
    return (
      <div className="bg-neutral-800 rounded-xl p-4 mt-4 font-[family-name:var(--font-geist-mono)] tracking-tighter">
        <div className="flex justify-between items-center">
          <div className="text-[#12ff80] font-medium text-sm">Multi-signature Status</div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-xs">No pending transactions</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>
    );
  }

  const { confirmations, confirmationsRequired } = pendingTx;
  const remainingSignatures = confirmationsRequired - (confirmations?.length || 0);

  return (
    <div className="bg-neutral-800 rounded-xl p-4 mt-4">
      <div className="text-[#12ff80] font-medium text-sm mb-2 font-[family-name:var(--font-geist-mono)] tracking-tighter">Multi-signature Status</div>
      <div className="flex items-center gap-2">
        <div className="w-full bg-neutral-700 rounded-full h-2">
          <div 
            className="bg-[#12ff80] h-2 rounded-full transition-all duration-300 mr-4"
            style={{ width: `${((confirmations?.length || 0) / confirmationsRequired) * 100}%` }}
          />
        </div>
        <div className="text-neutral-400 text-sm whitespace-nowrap font-[family-name:var(--font-geist-mono)] tracking-tighter ml-5">
          {confirmations?.length || 0}/{confirmationsRequired} signatures
        </div>
      </div>
      {remainingSignatures > 0 && (
        <div className="text-neutral-400 text-sm mt-2">
          Waiting for {remainingSignatures} more {remainingSignatures === 1 ? 'signature' : 'signatures'}...
        </div>
      )}
    </div>
  );
};

export default SafeTxTracker; 