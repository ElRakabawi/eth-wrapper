'use client'

import React, { useState, useMemo } from 'react';
import { ASSETS } from "@/app/constants";
import TokenInput from "../TokenInput";
import Image from "next/image";
import { Assets } from "@/app/types";
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useWeth } from '@/app/hooks/useWeth';
import useIsSafe from '@/app/hooks/useIsSafe';
import SafeTxTracker from '@/app/components/SafeTxTracker';

const Wrap: React.FC = () => {
  const { [Assets.ETH]: eth, [Assets.WETH]: weth } = ASSETS;
  const [amount, setAmount] = useState<string>('');
  const [isWrapping, setIsWrapping] = useState<boolean>(true);
  const [hasPendingSafeTx, setHasPendingSafeTx] = useState<boolean>(false);
  const { isConnected } = useAccount();
  const { isSafe } = useIsSafe();
  const { openConnectModal } = useConnectModal();
  const { wrapEth, unwrapWeth, isLoading, wethBalance, ethBalance } = useWeth();

  const handleAction = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    if (!amount) return;
    if (isWrapping) {
      await wrapEth(amount);
    } else {
      await unwrapWeth(amount);
    }
  };

  const buttonText = useMemo(() => {
    if (isLoading && !isSafe) {
      return isWrapping ? 'Wrapping...' : 'Unwrapping...';
    } else {
      if(hasPendingSafeTx) return 'Safe Transaction Pending...';
      return isWrapping ? 'Wrap' : 'Unwrap';
    }
  }, [isLoading, isWrapping, isSafe, hasPendingSafeTx]);

  return (
    <div className="flex justify-center items-center h-full px-4">
      <div className="bg-neutral-800 rounded-3xl p-6 w-full max-w-[480px] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-neutral-50 text-lg font-semibold m-0">{isWrapping ? "Wrap ETH" : "Unwrap WETH"}</h2>
        </div>

        <div className="flex flex-col gap-1">
          <TokenInput 
            token={isWrapping ? eth : weth}
            amount={amount}
            onAmountChange={setAmount}
            showMax={true}
            balance={isWrapping ? ethBalance : wethBalance}
          />

          <button onClick={() => setIsWrapping(!isWrapping)} className="bg-neutral-900 border-2 border-neutral-800 text-neutral-50 w-10 h-10 rounded-xl mx-auto cursor-pointer flex items-center justify-center hover:bg-neutral-700 transition-colors -my-5 z-10 group">
            <Image src="/icons/arrow-down.svg" alt="Swap" width={24} height={24} className="group-hover:rotate-180 transform duration-300 transition-transform" />
          </button>

          <TokenInput 
            token={isWrapping ? weth : eth}
            amount={amount}
            onAmountChange={setAmount}
            balance={isWrapping ? wethBalance : ethBalance}
          />
        </div>

        <button 
          className="w-full bg-blue-500 text-white border-none rounded-2xl py-3 text-md font-semibold mt-6 cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handleAction}
          disabled={(!isSafe && isLoading) || !amount || (isSafe && hasPendingSafeTx)}
        >
          {isConnected ? buttonText : "Connect Wallet"}
        </button>

        {isSafe && <SafeTxTracker onPendingTxChange={setHasPendingSafeTx} />}
      </div>
    </div>
  );
};

export default Wrap; 