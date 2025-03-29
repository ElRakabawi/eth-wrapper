import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useAccount, useReadContract, useBalance, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { WETH_ABI } from '../abi/weth';
import { NETWORKS, SEPOLIA_SCAN_URL } from '../constants';
import { Networks } from '../types';
import { wagmiConfig } from '../components/Web3Providers';

export const useWeth = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
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

  const wrapEth = useCallback(async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      const parsedAmount = parseEther(amount);
      const wrapTxHash = await writeContractAsync({
        abi: WETH_ABI,
        functionName: 'deposit',
        address: wethAddress,
        value: parsedAmount,
      });
      
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: wrapTxHash,
      });
      
      if (receipt.status === 'success') {
        refetchWethBalance();
        refetchEthBalance();
        toast.success('ETH wrapped successfully', {
          action: {
            label: 'View on Etherscan',
            onClick: () => window.open(`${SEPOLIA_SCAN_URL}/tx/${wrapTxHash}`, '_blank'),
          },
        });
      } else {
        toast.error('ETH wrapped failed');
      }
    } catch (error) {
      toast.error(`Failed to wrap ETH: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [address, wethAddress, refetchWethBalance, refetchEthBalance, writeContractAsync]);

  const unwrapWeth = useCallback(async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setIsLoading(true);
      const parsedAmount = parseEther(amount);
      const unwrapTxHash = await writeContractAsync({
        abi: WETH_ABI,
        functionName: 'withdraw',
        address: wethAddress,
        args: [parsedAmount],
      });
      
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        hash: unwrapTxHash,
      });

      if (receipt.status === 'success') {
        refetchWethBalance();
        refetchEthBalance();
        toast.success('WETH unwrapped successfully', {
          action: {
            label: 'View on Etherscan',
            onClick: () => window.open(`${SEPOLIA_SCAN_URL}/tx/${unwrapTxHash}`, '_blank'),
          },
        });
      } else {
        toast.error('WETH unwrapped failed');
      }
    } catch (error) {
      toast.error(`Failed to unwrap WETH: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [address, wethAddress, refetchWethBalance, refetchEthBalance, writeContractAsync]);

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