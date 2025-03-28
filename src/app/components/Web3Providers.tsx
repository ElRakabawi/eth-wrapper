'use client';

import { darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { sepolia } from 'wagmi/chains';
import { safe } from 'wagmi/connectors';

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
  ssr: true,
});

export default function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme()} 
          modalSize="wide"
          initialChain={sepolia}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 