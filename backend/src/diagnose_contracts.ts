
import { createPublicClient, http, parseAbiItem } from 'viem';

// Mainnet Config from nadfun_client.ts
const RPC_URL = 'https://monad-mainnet.drpc.org';
const CURVE_ADDRESS = '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE';
const FACTORY_ADDRESS = '0x6B5F564339DbAD6b780249827f2198a841FEB7F3';
const ROUTER_ADDRESS = '0x6F6B8F1a20703309951a5127c45B49b1CD981A22';

const client = createPublicClient({
    transport: http(RPC_URL)
});

async function diagnose() {
    console.log('🔍 Starting Contract Diagnosis (Topic Dump)...');
    console.log('RPC:', RPC_URL);

    try {
        const blockNumber = await client.getBlockNumber();
        console.log(`Current Block: ${blockNumber}`);

        // 6. Trace LOVELACE creation to find the REAL CurveCreate event
        console.log(`\n6. Finding LOVELACE Creation Logs...`);
        const LOVELACE = '0xBCcf0FA1ab655446d011540d0Fe4947e57827777';

        // Search last 200,000 blocks (approx 1-2 days on Monad?)
        const startBlock = blockNumber - 200000n;
        const transferLogs = await client.getLogs({
            address: LOVELACE as `0x${string}`,
            fromBlock: startBlock,
            toBlock: blockNumber,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
            args: { from: '0x0000000000000000000000000000000000000000' }
        });

        if (transferLogs.length > 0) {
            console.log(`✅ Found Mint Event: ${transferLogs[0].transactionHash}`);
            const txHash = transferLogs[0].transactionHash;

            // Get Receipt to see ALL logs in that transaction
            const receipt = await client.getTransactionReceipt({ hash: txHash });
            console.log(`\n📜 Transaction Logs (${receipt.logs.length}):`);

            receipt.logs.forEach((log, i) => {
                console.log(`\n[Log #${i}] Address: ${log.address}`);
                console.log(`Topics: ${JSON.stringify(log.topics)}`);
                if (log.address.toLowerCase() === CURVE_ADDRESS.toLowerCase()) {
                    console.log('⭐️ THIS LOG IS FROM THE BONDING CURVE!');
                }
            });
        } else {
            console.log('❌ Mint event not found in recent blocks. Try wider range?');
        }

        const contracts = [
            { name: 'CURVE', address: CURVE_ADDRESS },
            { name: 'FACTORY', address: FACTORY_ADDRESS },
            { name: 'ROUTER', address: ROUTER_ADDRESS }
        ];

        for (const c of contracts) {
            console.log(`\nScanning ${c.name} (${c.address})...`);
            try {
                // Check code first
                const code = await client.getBytecode({ address: c.address as `0x${string}` });
                if (!code) {
                    console.log(`❌ NO CODE at ${c.name}`);
                    continue;
                }

                // Get logs
                const logs = await client.getLogs({
                    address: c.address as `0x${string}`,
                    fromBlock: blockNumber - 1000n,
                    toBlock: blockNumber
                });

                console.log(`Found ${logs.length} logs in last 1000 blocks.`);

                if (logs.length > 0) {
                    console.log('Sample Topics (Last 3 logs):');
                    logs.slice(-3).forEach((log, i) => {
                        console.log(`Log #${i}: ${JSON.stringify(log.topics)}`);
                    });

                    // Check for CurveCreate hash specifically
                    const curveCreateHash = '0xd37e3f4f651fe74251701614dbeac478f5a0d29068e87bbe44e5026d166abca9';
                    const match = logs.find(l => l.topics[0] === curveCreateHash);
                    if (match) {
                        console.log('✅ FOUND CurveCreate MATCH!');
                    } else {
                        console.log('❌ No CurveCreate match.');
                    }
                }
            } catch (e) {
                console.log(`❌ Error scanning ${c.name}:`, e);
            }
        }

    } catch (error) {
        console.error('❌ Diagnosis Failed:', error);
    }
}

diagnose();
