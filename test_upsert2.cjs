require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('products').upsert({
    id: 2, name: 'iTunes Gift Card', category: 'Entertainment', price: 15, stock: 7, icon: '🎵', description: 'Buy music...', tag: 'SALE'
  });
  console.log(error || 'Success');
}
run();
