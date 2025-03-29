'use client'

import React, { useEffect, useMemo } from 'react';
import { useSafe, createConfig } from '@safe-global/safe-react-hooks';
import { sepolia } from 'wagmi/chains';
import { useAccount } from 'wagmi';
import { ethAddress } from 'viem';

const SafeTxTracker: React.FC = () => {
  const { address } = useAccount();
  const config = useMemo(() => createConfig({
    chain: sepolia,
    safeAddress: address,
    signer: ethAddress, // dummy signer for read-only provider
    provider: sepolia.rpcUrls.default.http[0],
  }), [address]);
  
  const { getPendingTransactions } = useSafe();
  const { data: pendingTxs, refetch: refetchPendingTxs} = getPendingTransactions({ config });
  const pendingTx = pendingTxs?.find(tx => JSON.parse(tx?.origin || '{}').name === "EthWrapper");


  useEffect(() => {
    const interval = setInterval(() => {
      refetchPendingTxs();
    }, 2000);

    return () => clearInterval(interval);
  }, [refetchPendingTxs]);


  if (!pendingTx) {
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