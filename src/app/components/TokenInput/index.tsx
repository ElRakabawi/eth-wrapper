'use client'

import React from 'react';
import Image from "next/image";
import { Token } from "@/app/types";

interface TokenInputProps {
  token: Token;
  amount: string;
  onAmountChange: (value: string) => void;
  showMax?: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({ token, amount, onAmountChange, showMax = false }) => {
  return (
    <div className="bg-neutral-900 rounded-3xl px-6 py-8 flex flex-row gap-2">
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder="0.0"
        className="bg-transparent border-none text-neutral-50 text-2xl w-full outline-none placeholder:text-neutral-500 overflow-hidden"
      />
      <div className="flex flex-col gap-3 items-end">
        <div className="flex items-center gap-2 text-neutral-50">
          <Image src={token.logoURI} alt={token.symbol} width={24} height={24} className="rounded-full" />
          <span>{token.symbol}</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className="flex items-center text-sm gap-2 text-neutral-500 whitespace-nowrap font-[family-name:var(--font-geist-mono)]">
            0.00 {token.symbol}
          </div>
          {showMax && (
            <div className="bg-neutral-800 text-neutral-500 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-neutral-700 transition-colors active:opacity-50 select-none">
              Max
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenInput; 