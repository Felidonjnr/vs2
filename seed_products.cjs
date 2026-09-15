require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
const INITIAL_PRODUCTS = [
  { id: 1, name: "Amazon Gift Card", category: "Shopping", price: 25, stock: 14, icon: "🛒", description: "Shop millions of items instantly on Amazon. Works globally.", tag: "HOT", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=2070", rating: 4.8 },
  { id: 2, name: "iTunes Gift Card", category: "Entertainment", price: 15, stock: 7, icon: "🎵", description: "Buy music, movies, and apps on the App Store and iTunes.", tag: "SALE", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=2000", rating: 4.5 },
  { id: 3, name: "Steam Wallet Code", category: "Gaming", price: 50, stock: 2, icon: "🎮", description: "Add funds to your Steam Wallet and purchase thousands of games.", tag: "LOW", image: "https://images.unsplash.com/photo-1629856515865-c7e14f6b216f?auto=format&fit=crop&q=80&w=2000", rating: 4.9 },
  { id: 4, name: "Netflix Premium 1M", category: "Streaming", price: 12, stock: 45, icon: "🎬", description: "Enjoy ultra HD streaming on up to 4 devices simultaneously for a full month.", image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=2070", rating: 4.7 },
  { id: 5, name: "Google Play Card", category: "Mobile", price: 20, stock: 8, icon: "📱", description: "Get the latest apps, movies, and books on Google Play.", tag: "HOT", image: "https://images.unsplash.com/photo-1607252656733-fd74218a73bc?auto=format&fit=crop&q=80&w=2071", rating: 4.6 },
  { id: 6, name: "Spotify Premium 3M", category: "Streaming", price: 30, stock: 22, icon: "🎧", description: "Ad-free music listening, offline playback, and supreme audio quality for 3 months.", image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=1974", rating: 4.8 },
  { id: 7, name: "PlayStation Store Plus", category: "Gaming", price: 60, stock: 5, icon: "👾", description: "Access online multiplayer, exclusive discounts, and free monthly games.", tag: "LOW", image: "https://images.unsplash.com/photo-1606144042871-2092cc7dd1cc?auto=format&fit=crop&q=80&w=2070", rating: 4.9 },
  { id: 8, name: "Xbox Game Pass Ultimate", category: "Gaming", price: 45, stock: 12, icon: "🕹️", description: "Play over 100 high-quality games on console, PC, and mobile devices.", image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=2062", rating: 4.9 },
  { id: 9, name: "Uber Eats Gift Card", category: "Shopping", price: 25, stock: 30, icon: "🍔", description: "Order your favorite food from local restaurants directly to your door.", tag: "HOT", image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&q=80&w=2071", rating: 4.5 },
  { id: 10, name: "Roblox Robux", category: "Gaming", price: 10, stock: 100, icon: "🧱", description: "Enhance your avatar and buy special abilities in Roblox.", tag: "SALE", image: "https://images.unsplash.com/photo-1614138139414-b1b70c399587?auto=format&fit=crop&q=80&w=2000", rating: 4.6 },
];

async function run() {
  const { data, error } = await supabase.from('products').upsert(INITIAL_PRODUCTS);
  console.log(error || 'Seeded successfully');
}
run();
