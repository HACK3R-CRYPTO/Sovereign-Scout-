export interface Token {
    name: string;
    symbol: string;
    address: string;
    pool?: string; // Bonding curve pool address
    launchTime: number;
    creator: string;
    liquidity?: number;
    marketCap?: number;
    holderCount?: number;
    createdAt?: Date;
}

export interface PortfolioHolding {
    symbol: string;
    amount: number;
    avgPrice: number;
    timestamp: number;
    pool?: string; // Optional pool address for legacy holdings
}

export interface Portfolio {
    holdings: { [address: string]: PortfolioHolding };
    totalBalance: number;
    updatedAt: number;
}

export interface InvestmentDecision {
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reason: string;
}

export interface TradeResult {
    success: boolean;
    amount: number;
    price: number;
    txHash?: string;
    error?: string;
}

export interface SentimentData {
    score: number;
    mentions: number;
    source: string;
}

export interface MoltbookAgent {
    id: string;
    name: string;
    karma: number;
    avatar_url: string;
    is_claimed: boolean;
    owner: {
        x_handle: string;
        x_verified: boolean;
    };
}

export interface MoltbookVerifyResponse {
    valid: boolean;
    agent?: MoltbookAgent;
    error?: string;
}
