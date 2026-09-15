require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('cryptos').insert([{ id: 'btc', name: 'Bitcoin 2', symbol: 'BTC', icon: 'B', color: '#000', address: 'test' }]);
  console.log('Error:', error?.message);
}
run();
