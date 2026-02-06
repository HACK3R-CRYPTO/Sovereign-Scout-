import chalk from 'chalk';

interface Config {
    monad: {
        rpcUrl: string;
        privateKey?: string;
        chainId: number;
    };
    nadFun: {
        apiUrl: string;
        apiKey?: string;
    };
    moltbook: {
        apiUrl: string;
        apiKey?: string;
    };
    openai: {
        apiKey?: string;
    };
    twitter: {
        apiKey?: string;
        apiSecret?: string;
        accessToken?: string;
        accessSecret?: string;
    };
    scoutToken: {
        address?: string;
    };
}

class ConfigValidator {
    private config: Config;
    private errors: string[] = [];
    private warnings: string[] = [];

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): Config {
        return {
            monad: {
                rpcUrl: process.env.MONAD_RPC_URL || 'https://monad-mainnet.drpc.org',
                privateKey: process.env.MONAD_PRIVATE_KEY,
                chainId: parseInt(process.env.MONAD_CHAIN_ID || '143')
            },
            nadFun: {
                apiUrl: process.env.NADFUN_API_URL || 'https://api.nadapp.net',
                apiKey: process.env.NADFUN_API_KEY
            },
            moltbook: {
                apiUrl: process.env.MOLTBOOK_API_URL || 'https://api.moltbook.xyz',
                apiKey: process.env.MOLTBOOK_API_KEY
            },
            openai: {
                apiKey: process.env.OPENAI_API_KEY
            },
            twitter: {
                apiKey: process.env.TWITTER_API_KEY,
                apiSecret: process.env.TWITTER_API_SECRET,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessSecret: process.env.TWITTER_ACCESS_SECRET
            },
            scoutToken: {
                address: process.env.SCOUT_TOKEN_ADDRESS
            }
        };
    }

    validate(): boolean {
        console.log(chalk.bold.cyan('\n🔍 Validating Configuration...\n'));

        // Check Monad configuration
        if (!this.config.monad.rpcUrl) {
            this.errors.push('MONAD_RPC_URL is not set');
        }

        if (!this.config.monad.privateKey || this.config.monad.privateKey === 'your_private_key_here') {
            this.warnings.push('MONAD_PRIVATE_KEY not configured - Running in SIMULATION mode');
        } else if (!this.config.monad.privateKey.startsWith('0x') || this.config.monad.privateKey.length !== 66) {
            this.warnings.push('MONAD_PRIVATE_KEY format may be invalid (expected 0x + 64 hex chars)');
        }

        // Check API keys
        if (!this.config.nadFun.apiKey) {
            this.warnings.push('NADFUN_API_KEY not set - Using mock data');
        }

        if (!this.config.moltbook.apiKey) {
            this.warnings.push('MOLTBOOK_API_KEY not set - Using mock data');
        const hasAllTwitterCreds = this.config.twitter.apiKey && 
                                   this.config.twitter.apiSecret && 
                                   this.config.twitter.accessToken && 
                                   this.config.twitter.accessSecret;
        if (!hasAllTwitterCreds) {
            this.warnings.push('Twitter API credentials incomplete - Social features disabled');
        }

        }

        if (!this.config.openai.apiKey) {
            this.warnings.push('OPENAI_API_KEY not set - Sentiment analysis will use basic scoring');
        }

        if (!this.config.scoutToken.address) {
            this.warnings.push('SCOUT_TOKEN_ADDRESS not set - Token not yet launched');
        }

        // Display results
        this.displayResults();

        return this.errors.length === 0;
    }

    private displayResults(): void {
        if (this.errors.length > 0) {
            console.log(chalk.bold.red('❌ Configuration Errors:'));
            this.errors.forEach(error => {
                console.log(chalk.red(`  • ${error}`));
            });
            console.log('');
        }

        if (this.warnings.length > 0) {
            console.log(chalk.bold.yellow('⚠️  Configuration Warnings:'));
            this.warnings.forEach(warning => {
                console.log(chalk.yellow(`  • ${warning}`));
            });
            console.log('');
        }

        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log(chalk.bold.green('✅ Configuration Valid - All systems ready!\n'));
        } else if (this.errors.length === 0) {
            console.log(chalk.bold.cyan('✅ Configuration Valid - Ready to start with warnings\n'));
        }
    }

    getConfig(): Config {
        return this.config;
    }

    displaySummary(): void {
        console.log(chalk.bold.white('📋 Current Configuration:'));
        console.log(chalk.gray('  Monad RPC:'), this.config.monad.rpcUrl);
        console.log(chalk.gray('  Monad Chain ID:'), this.config.monad.chainId);
        console.log(chalk.gray('  Nad.fun API:'), this.config.nadFun.apiUrl);
        console.log(chalk.gray('  Moltbook API:'), this.config.moltbook.apiUrl);
        console.log(chalk.gray('  Wallet:'), this.config.monad.privateKey ? '🔐 Configured' : '⚠️  Not set');
        console.log(chalk.gray('  Scout Token:'), this.config.scoutToken.address || 'Not deployed');
        console.log('');
    }
}

export default new ConfigValidator();
