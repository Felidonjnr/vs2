require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('orders').insert([{ id: 'VC-12345', productId: 1, productName: 'Test', qty: 1, total: 1, cryptoSymbol: 'BTC', email: 'test@test.com', timestamp: Date.now(), status: 'pending' }]);
  console.log('Error1:', error?.message);
  const { data: data2, error: error2 } = await supabase.from('orders').insert([{ id: 'VC-12345', productId: 2, productName: 'Test 2', qty: 1, total: 1, cryptoSymbol: 'BTC', email: 'test@test.com', timestamp: Date.now(), status: 'pending' }]);
  console.log('Error2:', error2?.message);
}
run();
