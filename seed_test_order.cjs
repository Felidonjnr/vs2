require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const o = { id: `TEST-${Date.now()}`, productId: 1, productName: 'Test Prod', qty: 1, total: 10, cryptoSymbol: 'BTC', email: 'test@example.com', timestamp: Date.now(), status: 'pending' };
  const { data, error } = await supabase.from('orders').insert([o]);
  console.log('Insert:', error || 'Success');
}
run();
