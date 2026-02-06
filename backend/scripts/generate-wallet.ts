import { Wallet } from 'ethers';

// Generate a new random wallet
const wallet = Wallet.createRandom();

console.log('\n🔐 NEW MONAD TESTNET WALLET GENERATED\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n⚠️  IMPORTANT:');
console.log('1. Save this private key securely');
console.log('2. Add it to your .env file as MONAD_PRIVATE_KEY');
console.log('3. Get testnet MON tokens from the faucet');
console.log('4. NEVER share your private key with anyone\n');
