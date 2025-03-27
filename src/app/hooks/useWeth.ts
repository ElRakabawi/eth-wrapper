import { useCallback, useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useWatchContractEvent, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { toast } from 'sonner';
import { WETH_ABI } from '../abi/weth';
import { NETWORKS } from '../constants';
import { Networks } from '../types';

export const useWeth = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Contract address from constants
  const wethAddress = NETWORKS[Networks.SEPOLIA].WETH;

  // Read WETH balance
  const { data: wethBalance, refetch: refetchWethBalance } = useReadContract({
    address: wethAddress,
    abi: WETH_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  // Read ETH balance
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address: address as `0x${string}`,
  });

  // Write contract functions
  const { writeContract } = useWriteContract();

  // Watch for Withdrawal events
  useWatchContractEvent({
    address: wethAddress,
    abi: WETH_ABI,
    eventName: 'Withdrawal',
    onLogs: () => {
      toast.success('Successfully unwrapped WETH to ETH');
      setIsLoading(false);
      refetchWethBalance();
      refetchEthBalance();
    },
  });

  const wrapEth = useCallback(async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      const parsedAmount = parseEther(amount);
      await writeContract({
        abi: WETH_ABI,
        functionName: 'deposit',
        address: wethAddress,
        value: parsedAmount,
      });
    } catch (error) {
      toast.error(`Failed to wrap ETH: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [address, writeContract, wethAddress]);

  const unwrapWeth = useCallback(async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      const parsedAmount = parseEther(amount);
      await writeContract({
        abi: WETH_ABI,
        functionName: 'withdraw',
        address: wethAddress,
        args: [parsedAmount],
      });
    } catch (error) {
      toast.error(`Failed to unwrap WETH: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [address, writeContract, wethAddress]);

  return {
    wrapEth,
    unwrapWeth,
    isLoading,
    wethBalance: wethBalance ? {
      value: wethBalance as bigint,
      decimals: 18,
      symbol: 'WETH',
      formatted: formatEther(wethBalance as bigint),
    } : undefined,
    ethBalance: ethBalance
  };
}; 