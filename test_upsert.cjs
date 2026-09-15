require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('products').upsert({
    id: 1, name: 'Amazon Gift Card', category: 'Testing', price: 25, stock: 14, tag: 'HOT'
  });
  console.log(error || 'Success');
}
run();
