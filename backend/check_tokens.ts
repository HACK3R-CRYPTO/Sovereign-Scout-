import { nadFunClient } from './src/nadfun_client';

async function check() {
  await nadFunClient.initialize(process.env.MONAD_PRIVATE_KEY);
  
  const tokens = [
    { name: 'PRESCIO', address: '0xffC86Ab0C36B0728BbF52164f6319762DA867777' },
    { name: 'abc', address: '0x041E6DE342281c413823c6DC9d573CbA4a247777' }
  ];
  
  for (const token of tokens) {
    console.log(`\n=== ${token.name} (${token.address}) ===`);
    const state = await nadFunClient.getCurveState(token.address as any);
    if (state) {
      console.log('Virtual MON Reserve:', Number(state.virtualMonReserve) / 1e18, 'MON');
      console.log('Real MON Reserve:', Number(state.realMonReserve) / 1e18, 'MON');
      console.log('Token Reserve:', Number(state.tokenReserve) / 1e18, 'tokens');
      console.log('Is Graduated:', state.isGraduated);
      console.log('Is Closed:', state.isClosed);
      console.log('Creator:', state.creator);
      console.log('Creator MON:', Number(state.creatorMon) / 1e18, 'MON');
    } else {
      console.log('❌ Could not fetch curve state - token might not exist or LENS contract issue');
    }
  }
}

check().catch(console.error).finally(() => process.exit(0));
