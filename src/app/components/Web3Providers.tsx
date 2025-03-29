'use client';

import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { sepolia } from 'wagmi/chains';
import { safe } from 'wagmi/connectors';
import { SafeProvider, createConfig as createSafeConfig } from '@safe-global/safe-react-hooks';
import { ethAddress } from 'viem';

const queryClient = new QueryClient();
const sepoliaTransport = http('https://gateway.tenderly.co/public/sepolia');

const { connectors } = getDefaultWallets({
  appName: 'EthWrapper',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
});

export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: sepoliaTransport,
  },
  connectors: [
    safe({
      allowedDomains: [/app.safe.global$/],
      debug: process.env.NODE_ENV === 'development',
    }),
    ...connectors,
  ],
});

// initial config: will be replaced with SWC Safe address in the hooks
const safeConfig = createSafeConfig({
  chain: sepolia,
  signer: ethAddress,
  provider: sepolia.rpcUrls.default.http[0],
  // dummy new safe options to avoid client initialization error
  safeOptions: {
    owners: [ethAddress],
    threshold: 1,
  }
});


export default function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
      <SafeProvider config={safeConfig}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
              <RainbowKitProvider 
                theme={darkTheme()} 
                initialChain={sepolia}
              >
                {children}
              </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SafeProvider>
  );
} 