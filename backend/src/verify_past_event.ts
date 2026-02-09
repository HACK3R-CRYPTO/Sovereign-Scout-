
import { createPublicClient, http, keccak256, toBytes } from 'viem';

const RPC_URL = 'https://monad-mainnet.drpc.org';
const CURVE_ADDRESS = '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE';
// CurveCreate signature hash
const TOPIC = '0xd37e3f4f651fe74251701614dbeac478f5a0d29068e87bbe44e5026d166abca9';

const client = createPublicClient({
    transport: http(RPC_URL)
});

async function verify() {
    console.log('🔍 Verifying Past CurveCreate Event...');

    // Target Block: approx 22 hours ago (Lovelace creation)
    // Current: 54317306
    // 22 hours * 3600 = 79200 blocks
    const targetBlock = BigInt(54317306) - BigInt(79200);
    const start = targetBlock - BigInt(5000);
    const end = targetBlock + BigInt(5000);

    console.log(`Scanning blocks ${start} to ${end} for Topic ${TOPIC}...`);

    try {
        const logs = await client.getLogs({
            address: CURVE_ADDRESS as `0x${string}`,
            fromBlock: start,
            toBlock: end,
            topics: [TOPIC as `0x${string}`]
        } as any);

        console.log(`Found ${logs.length} CurveCreate events.`);
        if (logs.length > 0) {
            console.log('✅ SUCCESS! Found a CurveCreate event.');
            console.log(`Tx Hash: ${logs[0].transactionHash}`);
            console.log('This confirms the Contract and Event Signature are CORRECT.');
        } else {
            console.log('❌ No CurveCreate event found in this range.');
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

verify();
