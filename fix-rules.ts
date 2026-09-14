import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey as string);

async function applySecurity() {
  // Create secure RLS policies directly using SQL
  const sql = `
    -- Enable RLS on all tables
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.cryptos ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies to prevent conflicts
    DROP POLICY IF EXISTS "Public can view products" ON public.products;
    DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
    DROP POLICY IF EXISTS "Public can view cryptos" ON public.cryptos;
    DROP POLICY IF EXISTS "Admins can manage cryptos" ON public.cryptos;
    DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
    DROP POLICY IF EXISTS "Admins can view orders" ON public.orders;
    DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Public can insert reviews" ON public.reviews;
    DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
    DROP POLICY IF EXISTS "Admins can manage settings" ON public.settings;

    -- PRODUCTS: Anyone can read, only Service Role can write
    CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
    
    -- CRYPTOS: Anyone can read, only Service Role can write
    CREATE POLICY "Public can view cryptos" ON public.cryptos FOR SELECT USING (true);
    
    -- ORDERS: Anyone can insert (create order), only Service Role can read/update (so users can't see each other's orders)
    CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
    
    -- REVIEWS: Anyone can read, anyone can insert
    CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
    CREATE POLICY "Public can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
    
    -- SETTINGS: Anyone can read, only Service Role can write
    CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);
  `;
  
  // Note: Since we don't have direct SQL execution access via the standard Supabase JS client,
  // we will instruct the user to run this in their dashboard.
  console.log("SQL script generated for manual execution.");
}

applySecurity();
