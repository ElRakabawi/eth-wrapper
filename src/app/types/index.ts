
  
export enum Assets {
    ETH = "ETH",
    WETH = "WETH"
  }
  
export enum Networks {
    SEPOLIA = "sepolia"
  }
  
export interface NetworkContract {
    WETH: string;
}

export interface Token {
    symbol: string;
    name: string;
    logoURI: string;
}