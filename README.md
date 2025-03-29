# ETH Wrapper

A modern web application for wrapping ETH to WETH and vice versa, with built-in support for Safe (formerly Gnosis Safe) multi-signature transactions.

Deployed at [https://eth-wrapper-livid.vercel.app](https://eth-wrapper-livid.vercel.app)

![Interface](/public/interface.png)

### Key Features
- ETH to WETH wrapping/unwrapping
- Real-time transaction status tracking
- Multi-signature transaction support via Safe

## Design Decisions

### Safe Integration
- Implemented `SafeTxTracker` component for monitoring multi-signature transactions
- Uses HTTP polling (1-second interval) to track transaction status [Not optimal, couldn't find alterantives]
- SWCs transaction execution status is tracked by diffing pending and executed transactions for the latest pending safe transaction using it's `SafeTxHash`. 
- Supports one pending transaction only (shows the last pending txn)

### Transaction Flow
1. User initiates wrap/unwrap action
2. For Safe transactions:
   - Transaction is queued for multi-signature approval
   - Progress is tracked via `SafeTxTracker`
   - Success notification with Etherscan link on completion
3. For regular transactions:
   - Direct execution with immediate feedback
   - Balance updates on completion

## Dependencies

```json
{
  "dependencies": {
    "@rainbow-me/rainbowkit": "^2.2.4",
    "@safe-global/safe-react-hooks": "^0.2.0",
    "@tanstack/react-query": "^5.69.0",
    "next": "15.2.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "sonner": "^1.4.0",
    "viem": "^2.23.15",
    "wagmi": "^2.14.15"
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

Simple tests for `TokenInput` and `Wrap` components can be found under `__tests__` and are done using Vitest and React Testing Library.

### TokenInput Component
- Token information rendering
- Input value change handling
- Balance display & Max amount functionality

### Wrap Interface
- Basic component rendering
- Wrap/Unwrap mode switching
- Action button state

Run tests with:
```bash
npm test
```

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID for wallet connections

## Network Support
Currently deployed on Sepolia testnet with the following contracts:
- WETH: `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14` (there's multiple WETH addreses on Sepolia, I choosed the whitelisted one on Uniswap)

## License
MIT
