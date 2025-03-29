import { ReactNode } from 'react'
import { WagmiProvider, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'wagmi'

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

export function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
} 