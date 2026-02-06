/**
 * NadFun Client - Pure viem implementation based on nad.fun documentation
 * Uses the Indexer API and Agent API for token discovery
 */

import { createPublicClient, createWalletClient, http, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import logger from './logger';

// Network configuration based on nad.fun documentation
const NETWORK = process.env.NADFUN_NETWORK || 'mainnet'; // 'testnet' | 'mainnet'

const CONFIG = {
  testnet: {
    chainId: 10143,
    rpcUrl: 'https://monad-testnet.drpc.org',
    apiUrl: 'https://dev-api.nad.fun',
    DEX_ROUTER: '0x5D4a4f430cA3B1b2dB86B9cFE48a5316800F5fb2',
    BONDING_CURVE_ROUTER: '0x865054F0F6A288adaAc30261731361EA7E908003',
    LENS: '0xB056d79CA5257589692699a46623F901a3BB76f1',
    CURVE: '0x1228b0dc9481C11D3071E7A924B794CfB038994e',
    WMON: '0x5a4E0bFDeF88C9032CB4d24338C5EB3d3870BfDd',
    V3_FACTORY: '0xd0a37cf728CE2902eB8d4F6f2afc76854048253b',
    CREATOR_TREASURY: '0x24dFf9B68fA36f8400302e2babC3e049eA19459E',
  },
  mainnet: {
    chainId: 143,
    rpcUrl: 'https://monad-mainnet.drpc.org',
    apiUrl: 'https://api.nadapp.net',
    DEX_ROUTER: '0x0B79d71AE99528D1dB24A4148b5f4F865cc2b137',
    BONDING_CURVE_ROUTER: '0x6F6B8F1a20703309951a5127c45B49b1CD981A22',
    LENS: '0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea',
    CURVE: '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE',
    WMON: '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
    V3_FACTORY: '0x6B5F564339DbAD6b780249827f2198a841FEB7F3',
    CREATOR_TREASURY: '0x42e75B4B96d7000E7Da1e0c729Cec8d2049B9731',
  },
}[NETWORK as 'testnet' | 'mainnet'];

const chain = {
  id: CONFIG.chainId,
  name: 'Monad',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: [CONFIG.rpcUrl] } },
};

export interface TokenCreateEvent {
  token: Address;
  name: string;
  symbol: string;
  pool: Address; // Individual bonding curve pool contract
  creator: Address;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface CurveState {
  realMonReserve: bigint;
  virtualMonReserve: bigint;
  tokenReserve: bigint;
  creator: Address;
  creatorMon: bigint;
  isGraduated: boolean;
  isClosed: boolean;
}

class NadFunClient {
  public publicClient: any;
  public walletClient: any;
  public account: any;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NADFUN_API_KEY || '';
  }

  /**
   * Initialize the viem clients
   */
  async initialize(privateKey?: string): Promise<void> {
    try {
      // Create public client (for read operations)
      this.publicClient = createPublicClient({
        chain,
        transport: http(CONFIG.rpcUrl),
      });

      // Create wallet client (for write operations) if private key provided
      if (privateKey) {
        this.account = privateKeyToAccount(privateKey as `0x${string}`);
        
        this.walletClient = createWalletClient({
          account: this.account,
          chain,
          transport: http(CONFIG.rpcUrl),
        });

        // Get balance
        const balance = await this.publicClient.getBalance({ 
          address: this.account.address 
        });
        const balanceMON = Number(balance) / 1e18;

        logger.success('NadFun client initialized', {
          network: NETWORK,
          chainId: CONFIG.chainId,
          address: this.account.address,
          balance: `${balanceMON.toFixed(4)} MON`,
        });
      } else {
        logger.info('NadFun client initialized (read-only mode)', {
          network: NETWORK,
          chainId: CONFIG.chainId,
        });
      }
    } catch (error) {
      logger.error('Failed to initialize NadFun client', { error });
      throw error;
    }
  }

  /**
   * Fetch token creation events using the Indexer API or blockchain events
   * First tries API endpoints, then falls back to blockchain event queries
   * 
   * @param limit - Number of events to fetch (default: 20)
   * @param offset - Pagination offset (default: 0)
   * @returns Array of token creation events
   */
  async getTokenCreationEvents(
    limit: number = 20, 
    offset: number = 0
  ): Promise<TokenCreateEvent[]> {
    try {
      // Try multiple potential endpoints
      const endpoints = [
        `/indexer/curve/create?limit=${limit}&offset=${offset}`,
        `/api/indexer/curve/create?limit=${limit}&offset=${offset}`,
        `/curve/create?limit=${limit}&offset=${offset}`,
        `/tokens/recent?limit=${limit}&offset=${offset}`,
        `/v1/tokens?limit=${limit}&offset=${offset}`,
      ];

      for (const endpoint of endpoints) {
        try {
          const url = `${CONFIG.apiUrl}${endpoint}`;
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };

          // Add API key if available (for higher rate limits)
          if (this.apiKey) {
            headers['x-api-key'] = this.apiKey;
          }

          const response = await fetch(url, {
            method: 'GET',
            headers,
          });

          if (response.ok) {
            const data = await response.json();
            
            // The API returns the events in a 'data' or 'events' field
            const events = (data as any).data || (data as any).events || (data as any).tokens || data;
            
            if (!Array.isArray(events)) {
              continue; // Try next endpoint
            }

            if (events.length > 0) {
              logger.info(`Fetched ${events.length} token creation events from ${endpoint}`);
              return events;
            }
          }
        } catch (endpointError) {
          // Try next endpoint
          continue;
        }
      }

      // Fallback: Query blockchain events directly
      logger.info('API endpoints unavailable, querying blockchain events...');
      return await this.getTokenCreationEventsFromChain(limit);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to fetch token creation events', { error: errorMessage });
      return [];
    }
  }

  /**
   * Query token creation events directly from the blockchain
   * Uses the CURVE contract's CurveCreate event
   * 
   * @param limit - Number of events to fetch
   * @returns Array of token creation events
   */
  async getTokenCreationEventsFromChain(limit: number = 20): Promise<TokenCreateEvent[]> {
    try {
      const curveAddress = CONFIG.CURVE as Address;
      
      // CurveCreate event ABI - Pool is indexed!
      // emit CurveCreate(creator indexed, token indexed, pool indexed, name, symbol, tokenURI, virtualMon, virtualToken, targetTokenAmount)
      const curveCreateEventAbi = [
        {
          name: 'CurveCreate',
          type: 'event' as const,
          inputs: [
            { name: 'creator', type: 'address', indexed: true },
            { name: 'token', type: 'address', indexed: true },
            { name: 'pool', type: 'address', indexed: true }, // INDEXED!
            { name: 'name', type: 'string', indexed: false },
            { name: 'symbol', type: 'string', indexed: false },
            { name: 'tokenURI', type: 'string', indexed: false },
            { name: 'virtualMon', type: 'uint256', indexed: false },
            { name: 'virtualToken', type: 'uint256', indexed: false },
            { name: 'targetTokenAmount', type: 'uint256', indexed: false },
          ],
        },
      ] as const;

      // Get latest block
      const latestBlock = await this.publicClient.getBlockNumber();
      
      // Query in smaller chunks to avoid "block range too large" error
      // RPC typically allows 2000-5000 blocks per query
      const CHUNK_SIZE = 1000n;
      const MAX_BLOCKS_TO_SCAN = 10000n; // Scan last 10K blocks
      
      let allLogs: any[] = [];
      
      for (let i = 0n; i < MAX_BLOCKS_TO_SCAN / CHUNK_SIZE && allLogs.length < limit; i++) {
        const toBlock = latestBlock - (i * CHUNK_SIZE);
        const fromBlock = toBlock - CHUNK_SIZE + 1n;
        
        if (fromBlock < 0n) break;
        
        try {
          logger.info(`Querying CurveCreate events from block ${fromBlock} to ${toBlock}`);
          
          const logs = await this.publicClient.getContractEvents({
            address: curveAddress,
            abi: curveCreateEventAbi,
            eventName: 'CurveCreate',
            fromBlock,
            toBlock,
          });

          if (logs.length > 0) {
            logger.info(`Found ${logs.length} events in range ${fromBlock}-${toBlock}`);
            allLogs = [...allLogs, ...logs];
          }
          
          // If we have enough events, stop scanning
          if (allLogs.length >= limit) break;
          
        } catch (chunkError) {
          logger.warn(`Failed to query chunk ${fromBlock}-${toBlock}`, { error: chunkError });
          // Continue with next chunk
        }
      }

      if (allLogs.length === 0) {
        logger.info('No token creation events found in recent blocks');
        return [];
      }

      // Convert logs to TokenCreateEvent format
      const events: TokenCreateEvent[] = await Promise.all(
        allLogs.slice(-limit).map(async (log: any) => {
          try {
            const block = await this.publicClient.getBlock({ 
              blockNumber: log.blockNumber 
            });
            
            // CurveCreate event has all the data we need
            logger.info(`🔍 Raw log.args:`, log.args); // DEBUG
            
            const event = {
              token: log.args.token,
              name: log.args.name || 'Unknown',
              symbol: log.args.symbol || 'UNK',
              pool: log.args.pool, // Pool address from event
              creator: log.args.creator,
              blockNumber: log.blockNumber.toString(),
              blockTimestamp: block.timestamp.toString(),
              transactionHash: log.transactionHash,
            };
            logger.info(`🔍 Extracted event for ${event.symbol}`, { 
              token: event.token, 
              pool: event.pool,
              hasPool: !!event.pool 
            });
            return event;
          } catch (blockError) {
            // If we can't get block info, use approximate timestamp
            const event = {
              token: log.args.token,
              name: log.args.name || 'Unknown',
              pool: log.args.pool, // Pool address from event
              symbol: log.args.symbol || 'UNK',
              creator: log.args.creator,
              blockNumber: log.blockNumber.toString(),
              blockTimestamp: Math.floor(Date.now() / 1000).toString(),
              transactionHash: log.transactionHash,
            };
            logger.info(`🔍 Extracted event (fallback) for ${event.symbol}`, { 
              token: event.token, 
              pool: event.pool,
              hasPool: !!event.pool 
            });
            return event;
          }
        })
      );
      
      logger.success(`Found ${events.length} token creation events from blockchain`);
      
      return events;
    } catch (error) {
      logger.error('Failed to query blockchain events', { error });
      return [];
    }
  }

  /**
   * Get curve state for a specific token
   * Uses the LENS contract to query bonding curve information
   * 
   * @param tokenAddress - The token address to query
   * @returns Curve state information
   */
  async getCurveState(tokenAddress: Address): Promise<CurveState | null> {
    try {
      // LENS ABI for getCurveState function
      const lensAbi = [
        {
          name: 'getCurveState',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'token', type: 'address' }],
          outputs: [
            { name: 'realMonReserve', type: 'uint256' },
            { name: 'virtualMonReserve', type: 'uint256' },
            { name: 'tokenReserve', type: 'uint256' },
            { name: 'creator', type: 'address' },
            { name: 'creatorMon', type: 'uint256' },
            { name: 'isGraduated', type: 'bool' },
            { name: 'isClosed', type: 'bool' },
          ],
        },
      ];

      const result = await this.publicClient.readContract({
        address: CONFIG.LENS as Address,
        abi: lensAbi,
        functionName: 'getCurveState',
        args: [tokenAddress],
      }) as any;

      return {
        realMonReserve: result[0],
        virtualMonReserve: result[1],
        tokenReserve: result[2],
        creator: result[3],
        creatorMon: result[4],
        isGraduated: result[5],
        isClosed: result[6],
      };
    } catch (error) {
      logger.error(`Failed to get curve state for ${tokenAddress}`, { error });
      return null;
    }
  }

  /**
   * Get token balance for an address
   * 
   * @param tokenAddress - The token address
   * @param ownerAddress - The owner address
   * @returns Token balance as bigint
   */
  async getTokenBalance(
    tokenAddress: Address, 
    ownerAddress: Address
  ): Promise<bigint> {
    try {
      const erc20Abi = [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ];

      const balance = await this.publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [ownerAddress],
      }) as bigint;

      return balance;
    } catch (error) {
      logger.error(`Failed to get token balance`, { 
        token: tokenAddress, 
        owner: ownerAddress,
        error 
      });
      return 0n;
    }
  }

  /**
   * Get token metadata (name, symbol, decimals)
   * 
   * @param tokenAddress - The token address
   * @returns Token metadata
   */
  async getTokenMetadata(tokenAddress: Address): Promise<{
    name: string;
    symbol: string;
    decimals: number;
  } | null> {
    try {
      const erc20Abi = [
        {
          name: 'name',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'string' }],
        },
        {
          name: 'symbol',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'string' }],
        },
        {
          name: 'decimals',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ name: '', type: 'uint8' }],
        },
      ];

      const [name, symbol, decimals] = await Promise.all([
        this.publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'name',
        }),
        this.publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'symbol',
        }),
        this.publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'decimals',
        }),
      ]);

      return {
        name: name as string,
        symbol: symbol as string,
        decimals: decimals as number,
      };
    } catch (error) {
      logger.error(`Failed to get token metadata for ${tokenAddress}`, { error });
      return null;
    }
  }

  /**
   * Get the progress of a token towards graduation (0-10000 = 0-100%)
   * Based on realMonReserve / target reserves
   */
  async getProgress(tokenAddress: Address): Promise<number> {
    const curveState = await this.getCurveState(tokenAddress);
    if (!curveState) return 0;

    // Typical graduation threshold is around 100 MON in reserves
    // This is approximate - actual value may vary
    const TARGET_RESERVES = 100n * 10n ** 18n; // 100 MON
    const progress = Number((curveState.realMonReserve * 10000n) / TARGET_RESERVES);
    
    return Math.min(progress, 10000); // Cap at 100%
  }

  /**
   * Check if a token has graduated to Uniswap V3
   */
  async isGraduated(tokenAddress: Address): Promise<boolean> {
    const curveState = await this.getCurveState(tokenAddress);
    return curveState?.isGraduated || false;
  }

  /**
   * Get configuration
   */
  getConfig() {
    return {
      network: NETWORK,
      ...CONFIG,
    };
  }
}

export const nadFunClient = new NadFunClient();
export default nadFunClient;
