import chalk from 'chalk';
import { Token, InvestmentDecision, TradeResult } from './types';
import logger from './logger';
import { nadFunClient } from './nadfun_client';
import type { Address } from 'viem';
import { parseEther, formatEther } from 'viem';

class TradeExecutor {
    // BondingCurveRouter ABI - use router for ALL trades, not individual pools
    private readonly BONDING_CURVE_ROUTER = '0x6F6B8F1a20703309951a5127c45B49b1CD981A22' as Address;
    
    private readonly ROUTER_ABI = [
        {
            name: 'buy',
            type: 'function',
            stateMutability: 'payable',
            inputs: [
                {
                    name: 'params',
                    type: 'tuple',
                    components: [
                        { name: 'amountOutMin', type: 'uint256' },
                        { name: 'token', type: 'address' },
                        { name: 'to', type: 'address' },
                        { name: 'deadline', type: 'uint256' },
                    ],
                },
            ],
            outputs: [], // No return value!
        },
        {
            name: 'sell',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
                {
                    name: 'params',
                    type: 'tuple',
                    components: [
                        { name: 'amountIn', type: 'uint256' },
                        { name: 'amountOutMin', type: 'uint256' },
                        { name: 'token', type: 'address' },
                        { name: 'to', type: 'address' },
                        { name: 'deadline', type: 'uint256' },
                    ],
                },
            ],
            outputs: [], // No return value!
        },
    ] as const;

    // ERC20 approve ABI
    private readonly ERC20_ABI = [
        {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
                { name: 'spender', type: 'address' },
                { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
        },
        {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
        },
    ] as const;

    /**
     * Executes a trade on the Monad network using NadFun bonding curve
     * @param decision Investment decision with action and confidence
     * @param token Token to trade
     * @param positionSize Position size in MON (ignored, uses testAmount)
     * @returns Trade result with success status, amount and price
     */
    async execute(decision: InvestmentDecision, token: Token, positionSize: number): Promise<TradeResult> {
        const { action, confidence } = decision;
        
        // TESTING MODE: Use small amounts (0.5 MON per trade)
        const testAmount = 0.5;
        
        if (!nadFunClient.walletClient) {
            logger.warn(`[READ-ONLY MODE] ${action} order for ${token.symbol} - Would trade ${testAmount} MON, Confidence: ${(confidence * 100).toFixed(0)}%`);
            return { success: true, amount: 0, price: 0 };
        }

        try {
            logger.info(`🔄 Preparing REAL ${action} transaction for ${token.symbol}...`);
            logger.info(`💰 Amount: ${testAmount} MON, Confidence: ${(confidence * 100).toFixed(0)}%`);
            
            if (action === 'BUY') {
                return await this.executeBuy(token, testAmount);
            } else if (action === 'SELL') {
                return await this.executeSell(token, testAmount);
            }

            return { success: false, amount: 0, price: 0, error: 'Invalid action' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`❌ Trade execution failed for ${token.symbol}`, { error: errorMessage });
            return { success: false, amount: 0, price: 0, error: errorMessage };
        }
    }

    /**
     * Execute a BUY transaction on the bonding curve pool (simplified - just send MON)
     */
    private async executeBuy(token: Token, monAmount: number): Promise<TradeResult> {
        try {
            logger.info(`🛒 Executing BUY for ${token.symbol}...`);
            
            if (!token.pool) {
                logger.error(`❌ No pool address for ${token.symbol}`);
                return { success: false, amount: 0, price: 0, error: 'No pool address' };
            }
            
            const poolAddress = token.pool as Address;
            const monAmountWei = parseEther(monAmount.toString());
            
            // Check balance before
            const balanceBefore = await nadFunClient.publicClient.readContract({
                address: token.address as Address,
                abi: this.ERC20_ABI,
                functionName: 'balanceOf',
                args: [nadFunClient.account.address],
            }) as bigint;

            logger.info(`📊 Buying ${monAmount} MON worth from pool ${poolAddress.slice(0, 10)}...`);
            
            // Execute buy through BondingCurveRouter
            const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes
            
            const hash = await nadFunClient.walletClient.writeContract({
                address: this.BONDING_CURVE_ROUTER,
                abi: this.ROUTER_ABI,
                functionName: 'buy',
                args: [
                    {
                        amountOutMin: 0n,
                        token: token.address as Address,
                        to: nadFunClient.walletClient.account.address,
                        deadline: BigInt(deadline),
                    },
                ],
                value: monAmountWei,
            });
            
            logger.info(`⏳ Transaction submitted: ${hash}`);
            
            // Wait for confirmation
            const receipt = await nadFunClient.publicClient.waitForTransactionReceipt({ 
                hash,
                confirmations: 1,
            });
            
            if (receipt.status === 'success') {
                // Check balance after to get actual tokens received
                const balanceAfter = await nadFunClient.publicClient.readContract({
                    address: token.address as Address,
                    abi: this.ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [nadFunClient.account.address],
                }) as bigint;

                const tokensReceived = balanceAfter - balanceBefore;
                const tokenAmount = Number(formatEther(tokensReceived));
                const price = tokenAmount > 0 ? monAmount / tokenAmount : 0;

                logger.success(`✅ BUY completed for ${token.symbol}!`, { 
                    amount: tokenAmount,
                    price: price,
                    txHash: hash,
                });

                return {
                    success: true,
                    amount: tokenAmount,
                    price: price,
                    txHash: hash
                };
            } else {
                logger.error(`❌ BUY reverted for ${token.symbol}`, { txHash: hash });
                return { success: false, amount: 0, price: 0, txHash: hash, error: 'Transaction reverted' };
            }
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error(`❌ BUY failed for ${token.symbol}`, { error: errorMessage });
            return { success: false, amount: 0, price: 0, error: errorMessage };
        }
    }

    /**
     * Execute a SELL transaction on the bonding curve pool
     */
    private async executeSell(token: Token, tokenAmount: number): Promise<TradeResult> {
        try {
            logger.info(`💸 Executing SELL for ${token.symbol}...`);
            
            if (!token.pool) {
                logger.error(`❌ No pool address for ${token.symbol}`);
                return { success: false, amount: 0, price: 0, error: 'No pool address' };
            }
            
            // For sell, we just use the current token amount
            const monBefore = await nadFunClient.publicClient.getBalance({
                address: nadFunClient.account.address,
            });

            // Need to approve router first
            logger.info(`🔓 Approving router to spend ${token.symbol}...`);
            const approveHash = await nadFunClient.walletClient.writeContract({
                address: token.address as Address,
                abi: this.ERC20_ABI,
                functionName: 'approve',
                args: [this.BONDING_CURVE_ROUTER, parseEther(tokenAmount.toString())],
            });
            await nadFunClient.publicClient.waitForTransactionReceipt({ hash: approveHash });

            const deadline = Math.floor(Date.now() / 1000) + 300;
            const hash = await nadFunClient.walletClient.writeContract({
                address: this.BONDING_CURVE_ROUTER,
                abi: this.ROUTER_ABI,
                functionName: 'sell',
                args: [
                    {
                        amountIn: parseEther(tokenAmount.toString()),
                        amountOutMin: 0n,
                        token: token.address as Address,
                        to: nadFunClient.walletClient.account.address,
                        deadline: BigInt(deadline),
                    },
                ],
            });

            const receipt = await nadFunClient.publicClient.waitForTransactionReceipt({ hash });
            
            if (receipt.status === 'success') {
                const monAfter = await nadFunClient.publicClient.getBalance({
                    address: nadFunClient.account.address,
                });
                const monReceived = Number(formatEther(BigInt(monAfter) - BigInt(monBefore)));
                const price = tokenAmount > 0 ? monReceived / tokenAmount : 0;

                return {
                    success: true,
                    amount: tokenAmount,
                    price: price,
                    txHash: hash
                };
            }

            return { success: false, amount: 0, price: 0, txHash: hash, error: 'Sell reverted' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return { success: false, amount: 0, price: 0, error: errorMessage };
        }
    }
}

export default new TradeExecutor();
