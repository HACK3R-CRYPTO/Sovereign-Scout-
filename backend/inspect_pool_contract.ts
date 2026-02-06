import dotenv from 'dotenv';
dotenv.config();

import { nadFunClient } from './src/nadfun_client';
import { parseEther, formatEther } from 'viem';
import type { Address } from 'viem';

async function inspectPool() {
    console.log('🔍 Inspecting pool contract...\n');
    
    await nadFunClient.initialize();
    
    const poolAddress: Address = '0xE9eae66BF8F4CD67Af02714Fe6B50d78c9473923';
    const tokenAddress: Address = '0xFceFb00BCfD3c5325E4929b4ABcB8b84fe577777';
    
    console.log(`Pool: ${poolAddress}`);
    console.log(`Token: ${tokenAddress}\n`);
    
    // Try to read some basic info from the pool
    const LENS_ABI = [
        {
            name: 'getCurveState',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'token', type: 'address' }],
            outputs: [
                { name: 'token', type: 'address' },
                { name: 'pool', type: 'address' },
                { name: 'creator', type: 'address' },
                { name: 'name', type: 'string' },
                { name: 'symbol', type: 'string' },
                { name: 'totalSupply', type: 'uint256' },
                { name: 'realMonReserve', type: 'uint256' },
                { name: 'realTokenReserve', type: 'uint256' },
                { name: 'virtualMonReserve', type: 'uint256' },
                { name: 'virtualTokenReserve', type: 'uint256' },
                { name: 'targetRealMonReserve', type: 'uint256' },
                { name: 'maxSupply', type: 'uint256' },
                { name: 'progress', type: 'uint256' },
            ],
        },
    ] as const;
    
    try {
        const lensAddress: Address = '0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea';
        console.log('📊 Fetching curve state from Lens...');
        
        const curveState = await nadFunClient.publicClient.readContract({
            address: lensAddress,
            abi: LENS_ABI,
            functionName: 'getCurveState',
            args: [tokenAddress],
        });
        
        console.log('\n✓ Curve State:');
        console.log(`Name: ${curveState[3]}`);
        console.log(`Symbol: ${curveState[4]}`);
        console.log(`Pool: ${curveState[1]}`);
        console.log(`Creator: ${curveState[2]}`);
        console.log(`Total Supply: ${formatEther(curveState[5])}`);
        console.log(`Real MON Reserve: ${formatEther(curveState[6])}`);
        console.log(`Real Token Reserve: ${formatEther(curveState[7])}`);
        console.log(`Virtual MON Reserve: ${formatEther(curveState[8])}`);
        console.log(`Virtual Token Reserve: ${formatEther(curveState[9])}`);
        console.log(`Target Real MON Reserve: ${formatEther(curveState[10])}`);
        console.log(`Max Supply: ${formatEther(curveState[11])}`);
        console.log(`Progress: ${curveState[12]}%`);
        
        // Calculate buy price for 0.5 MON
        const monAmount = parseEther('0.5');
        const x = curveState[6] + curveState[8]; // realMon + virtualMon
        const y = curveState[7] + curveState[9]; // realToken + virtualToken
        const k = x * y;
        const newX = x + monAmount;
        const newY = k / newX;
        const tokensOut = y - newY;
        
        console.log(`\n💰 Buy Quote for 0.5 MON:`);
        console.log(`Tokens Out: ${formatEther(BigInt(tokensOut))}`);
        
    } catch (error) {
        console.error('❌ Failed to fetch curve state:', error instanceof Error ? error.message : error);
    }
    
    // Try different buy function signatures
    console.log('\n🧪 Testing different buy signatures...\n');
    
    const testSignatures = [
        {
            name: 'buy() payable',
            abi: [{
                name: 'buy',
                type: 'function',
                stateMutability: 'payable',
                inputs: [],
                outputs: [{ name: 'amount', type: 'uint256' }],
            }] as const,
            args: [],
        },
        {
            name: 'buy(address to, address token)',
            abi: [{
                name: 'buy',
                type: 'function',
                stateMutability: 'payable',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'token', type: 'address' },
                ],
                outputs: [{ name: 'amountOut', type: 'uint256' }],
            }] as const,
            args: [
                '0xa91D5A0a64ED5eeF11c4359C4631279695A338ef' as Address,
                tokenAddress,
            ],
        },
        {
            name: 'buy(address token)',
            abi: [{
                name: 'buy',
                type: 'function',
                stateMutability: 'payable',
                inputs: [{ name: 'token', type: 'address' }],
                outputs: [{ name: 'amountOut', type: 'uint256' }],
            }] as const,
            args: [tokenAddress],
        },
    ];
    
    for (const sig of testSignatures) {
        console.log(`Testing: ${sig.name}`);
        try {
            // Try to simulate (not execute) the call
            const result = await nadFunClient.publicClient.simulateContract({
                address: poolAddress,
                abi: sig.abi,
                functionName: 'buy',
                args: sig.args as any,
                value: parseEther('0.5'),
                account: '0xa91D5A0a64ED5eeF11c4359C4631279695A338ef',
            });
            console.log(`  ✅ SIMULATION SUCCESS - amountOut: ${formatEther(result.result)}`);
        } catch (error) {
            console.log(`  ❌ ${error instanceof Error ? error.message.split('\n')[0] : error}`);
        }
    }
}

inspectPool().catch(console.error);
