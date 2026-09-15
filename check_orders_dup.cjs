require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data } = await supabase.from('orders').select('id, productName');
  console.log(data);
}
run();
