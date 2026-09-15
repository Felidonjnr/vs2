require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  console.log('Select:', error || data);
  if(data && data.length > 0) {
    const { error: updErr } = await supabase.from('orders').update({ status: 'completed' }).eq('id', data[0].id);
    console.log('Update:', updErr || 'Success');
  }
}
run();
