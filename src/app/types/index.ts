export enum Assets {
    ETH = "ETH",
    WETH = "WETH"
  }
  
export enum Networks {
    SEPOLIA = "sepolia"
  }
  
export interface NetworkContract {
    WETH: `0x${string}`;
}

export interface Token {
    logoURI: string;
    name: string;
    symbol: string;
}

export type WethContract = {
    deposit: (value: bigint) => Promise<void>;
    withdraw: (amount: bigint) => Promise<void>;
    balanceOf: (address: `0x${string}`) => Promise<bigint>;
};