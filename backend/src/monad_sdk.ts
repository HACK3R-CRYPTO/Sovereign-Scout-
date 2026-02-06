import { ethers } from 'ethers';
import chalk from 'chalk';
import logger from './logger';

interface MonadConfig {
    rpcUrl: string;
    privateKey?: string;
    chainId: number;
}

class MonadSDK {
    private provider: ethers.JsonRpcProvider | null = null;
    private wallet: ethers.Wallet | null = null;
    private config: MonadConfig;
    private isConnected: boolean = false;

    constructor(config: MonadConfig) {
        this.config = config;
    }

    async initialize(): Promise<boolean> {
        try {
            logger.info('Initializing Monad SDK...', { rpcUrl: this.config.rpcUrl });

            // Initialize provider
            this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);

            // Test connection
            const network = await this.provider.getNetwork();
            logger.success(`Connected to Monad network`, { 
                chainId: network.chainId.toString(), 
                name: network.name || 'Monad Testnet'
            });

            // Initialize wallet if private key is provided
            if (this.config.privateKey && 
                this.config.privateKey !== 'your_private_key_here' && 
                this.config.privateKey.length > 0) {
                
                this.wallet = new ethers.Wallet(this.config.privateKey, this.provider);
                const address = await this.wallet.getAddress();
                const balance = await this.provider.getBalance(address);
                
                logger.success(`Wallet initialized`, { 
                    address,
                    balance: ethers.formatEther(balance) + ' MON'
                });
            } else {
                logger.warn('No wallet configured - Running in read-only mode');
            }

            this.isConnected = true;
            return true;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Failed to initialize Monad SDK', { error: errorMessage });
            return false;
        }
    }

    getProvider(): ethers.JsonRpcProvider | null {
        return this.provider;
    }

    getWallet(): ethers.Wallet | null {
        return this.wallet;
    }

    async getBalance(address?: string): Promise<string> {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        const targetAddress = address || (this.wallet ? await this.wallet.getAddress() : null);
        if (!targetAddress) {
            throw new Error('No address provided and no wallet configured');
        }

        const balance = await this.provider.getBalance(targetAddress);
        return ethers.formatEther(balance);
    }

    async getBlockNumber(): Promise<number> {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        return await this.provider.getBlockNumber();
    }

    async getGasPrice(): Promise<string> {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        const feeData = await this.provider.getFeeData();
        return ethers.formatUnits(feeData.gasPrice || 0n, 'gwei');
    }

    isWalletConnected(): boolean {
        return this.wallet !== null;
    }

    isProviderConnected(): boolean {
        return this.isConnected;
    }

    async getNetworkInfo(): Promise<any> {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        const [network, blockNumber, gasPrice] = await Promise.all([
            this.provider.getNetwork(),
            this.provider.getBlockNumber(),
            this.getGasPrice()
        ]);

        return {
            chainId: network.chainId.toString(),
            name: network.name || 'Monad Testnet',
            blockNumber,
            gasPrice: gasPrice + ' gwei'
        };
    }
}

export default MonadSDK;
