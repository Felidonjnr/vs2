import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey as string);

const DEMO_PRODUCTS = [
  { id: 1, name: "Amazon Gift Card", category: "Shopping", price: 25, stock: 14, icon: "🛒", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=2070", rating: 4.8, description: "Shop millions of items instantly on Amazon. Works globally.", tag: "HOT" },
  { id: 2, name: "iTunes Gift Card", category: "Entertainment", price: 15, stock: 7, icon: "🎵", image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=2074", rating: 4.5, description: "Buy music, movies, apps and more from Apple.", tag: "SALE" },
  { id: 3, name: "Steam Wallet Code", category: "Gaming", price: 20, stock: 22, icon: "🎮", image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&q=80&w=2064", rating: 4.9, description: "Top up your Steam wallet and buy any game.", tag: null },
  { id: 4, name: "Netflix Premium", category: "Streaming", price: 30, stock: 3, icon: "🎬", image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=2069", rating: 5.0, description: "Stream unlimited movies and TV series on Netflix in stunning 4K.", tag: "LOW" },
  { id: 5, name: "Spotify Premium", category: "Streaming", price: 10, stock: 31, icon: "🎧", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2074", rating: 4.7, description: "Ad-free music streaming on any device.", tag: null },
  { id: 6, name: "Xbox Game Pass", category: "Gaming", price: 45, stock: 5, icon: "🕹️", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=2000", rating: 4.9, description: "Access 100+ games on Xbox and PC instantly.", tag: "SALE" },
  { id: 7, name: "PlayStation Store", category: "Gaming", price: 50, stock: 2, icon: "🎯", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=2070", rating: 4.6, description: "Buy PS5 and PS4 games and exclusive content.", tag: "HOT" },
  { id: 8, name: "Starbucks Card", category: "Shopping", price: 15, stock: 60, icon: "☕", image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=2071", rating: 4.2, description: "Treat yourself to your favorite coffee and treats.", tag: null },
  { id: 9, name: "Airbnb Gift Card", category: "Shopping", price: 100, stock: 4, icon: "🏠", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070", rating: 4.9, description: "Give the perfect getaway with an Airbnb gift card.", tag: null },
  { id: 10, name: "Uber Eats Card", category: "Shopping", price: 25, stock: 20, icon: "🍔", image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=2071", rating: 4.5, description: "Delicious food delivered right to your door.", tag: "HOT" }
];

async function seed() {
  for (const product of DEMO_PRODUCTS) {
    const { error } = await supabase.from('products').upsert([product]);
    if (error) console.error("Error inserting", product.name, error);
  }
  
  // Clean up any old products that aren't in this new list of 10
  const keepIds = DEMO_PRODUCTS.map(p => p.id);
  const { error: deleteError } = await supabase.from('products').delete().not('id', 'in', `(${keepIds.join(',')})`);
  
  console.log("Seeded products with images and ratings!");
}
seed();
