
import { keccak256, toBytes } from 'viem';

// The signature we are currently using
const currentSignature = 'CurveCreate(address,address,address,string,string,string,uint256,uint256,uint256)';
const hash = keccak256(toBytes(currentSignature));

console.log(`Signature: ${currentSignature}`);
console.log(`Hash: ${hash}`);

// Check potential alternatives if the ABI changed
const alts = [
    'CurveCreate(address,address,address,string,string,uint256,uint256,uint256)',
    'TokenCreated(address,address,address,string,string,uint256)',
    'Create(address,address,uint256)',
    'CurveCreate(address,address,address,string,string,string,uint256,uint256,uint256,bool)',
    'TokenLaunched(address,address,uint256)'
];

alts.forEach(sig => {
    console.log(`\nSignature: ${sig}`);
    console.log(`Hash: ${keccak256(toBytes(sig))}`);
});
