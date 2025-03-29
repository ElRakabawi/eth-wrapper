import { useAccount } from 'wagmi';

export const useIsSafe = () => {
  const { connector } = useAccount();

  const isSafe = connector?.id === 'safe';

  return { isSafe };
}

export default useIsSafe;