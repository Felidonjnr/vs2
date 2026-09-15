const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://lddelqtdfmjnzlwzylzz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZGVscXRkZm1qbnpsd3p5bHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzgwMjMsImV4cCI6MjEwNDg1NDAyM30.mX3TsDOOD30oWaVczgzmraft3CNGASsJdarCVntWSBs');
async function run() {
  const p = { id: Date.now(), name: 'Test Prod Anon', category: 'Shopping', price: 10, stock: 10, tag: null, icon: '🎁', description: 'Test' };
  const { data, error } = await supabase.from('products').insert([p]);
  console.log(error || 'Success');
}
run();
