import { Assets, Networks, NetworkContract, Token } from '../types/index';

export const ASSETS: Record<Assets, Token> = {
  [Assets.ETH]: {
    logoURI: "/icons/eth.png",
    name: "Ether",
    symbol: "ETH"
  },
  [Assets.WETH]: {
    logoURI: "/icons/weth.png",
    name: "Wrapped Ether", 
    symbol: "WETH"
  }
};

export const NETWORKS: Record<Networks, NetworkContract> = {
  [Networks.SEPOLIA]: {
    WETH: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"
  }
};

export const SEPOLIA_SCAN_URL = "https://sepolia.etherscan.io";


