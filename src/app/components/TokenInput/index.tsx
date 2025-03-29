'use client'

import React, { useMemo } from 'react';
import Image from "next/image";
import { Token } from "@/app/types";
import { GetBalanceData } from 'wagmi/query';
import { formatUnits } from 'viem';

interface TokenInputProps {
  token: Token;
  amount: string;
  onAmountChange: (value: string) => void;
  showMax?: boolean;
  balance?: GetBalanceData;
}

const TokenInput: React.FC<TokenInputProps> = ({ token, amount, onAmountChange, showMax = false, balance }) => {
  const formattedBalance = useMemo(() => 
    balance?.value ? 
    Number(formatUnits(balance.value, balance.decimals)).toLocaleString() : 
    '0.00', 
  [balance]);

  return (
    <div className="bg-neutral-900 rounded-3xl px-6 items-center h-[120px] flex flex-row gap-2">
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder="0.0"
        className="bg-transparent border-none text-neutral-50 text-2xl w-full outline-none placeholder:text-neutral-500 overflow-hidden"
      />
      <div className="flex flex-col gap-3 items-end w-full">
        <div className="flex flex-row items-center gap-2 text-neutral-50">
          <Image src={token.logoURI} alt={token.symbol} width={24} height={24} className="rounded-full" />
          <span>{token.symbol}</span>
        </div>
        <div onClick={() => showMax && onAmountChange(formattedBalance.replace(/,/g, ''))} className={`flex items-center text-sm gap-2 text-neutral-500 whitespace-nowrap font-[family-name:var(--font-geist-mono)] ${showMax ? 'cursor-pointer hover:text-white transition-all duration-300 active:scale-95 active:text-neutral-400' : ''}`}>
          {`${formattedBalance} ${token.symbol}`}
        </div>
      </div>
    </div>
  );
};

export default TokenInput; 