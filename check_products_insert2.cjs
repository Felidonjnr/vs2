require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const p = { id: Date.now(), name: 'Test Prod', category: 'Shopping', price: 10, stock: 10, tag: null, icon: '🎁', description: 'Test' };
  const { data, error } = await supabase.from('products').insert([p]);
  console.log(error || 'Success');
}
run();
