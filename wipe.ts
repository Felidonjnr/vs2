import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey as string);

async function wipe() {
  const { error } = await supabase.from('products').delete().neq('id', 0);
  if (error) console.error("Error wiping", error);
  else console.log("Wiped all products!");
}
wipe();
