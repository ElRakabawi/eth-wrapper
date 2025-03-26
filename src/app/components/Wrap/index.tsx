'use client'

import React, { useState } from 'react';
import { ASSETS } from "@/app/constants";
import TokenInput from "../TokenInput";
import Image from "next/image";
import { Assets } from "@/app/types";
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Wrap: React.FC = () => {
  const { [Assets.ETH]: eth, [Assets.WETH]: weth } = ASSETS;

  const [amount, setAmount] = useState<string>('');
  const [isWrapping, setIsWrapping] = useState<boolean>(true);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <div className="flex justify-center items-center h-full">
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
          />

          <button onClick={() => setIsWrapping(!isWrapping)} className="bg-neutral-900 border-2 border-neutral-800 text-neutral-50 w-10 h-10 rounded-xl mx-auto cursor-pointer flex items-center justify-center hover:bg-neutral-700 transition-colors -my-5 z-10 group">
            <Image src="/icons/arrow-down.svg" alt="Swap" width={24} height={24} className="group-hover:rotate-180 transform duration-300 transition-transform" />
          </button>

          <TokenInput 
            token={isWrapping ? weth : eth}
            amount={amount}
            onAmountChange={setAmount}
          />
        </div>

        <button className="w-full bg-blue-500 text-white border-none rounded-2xl py-3 text-md font-semibold mt-6 cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => {
          if (!isConnected) {
            openConnectModal?.();
          }
        }}>
          {isConnected ? isWrapping ? "Wrap" : "Unwrap" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Wrap; 