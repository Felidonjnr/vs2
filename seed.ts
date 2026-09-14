import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey as string);

const INITIAL_PRODUCTS = [
  { id: 1, name: "Amazon Gift Card", category: "Shopping", price: 25, stock: 14, icon: "🛒", description: "Shop millions of items instantly on Amazon. Works globally.", tag: "HOT" },
  { id: 2, name: "iTunes Gift Card", category: "Entertainment", price: 15, stock: 7, icon: "🎵", description: "Buy music, movies, apps and more from Apple.", tag: "SALE" },
  { id: 3, name: "Steam Wallet Code", category: "Gaming", price: 20, stock: 22, icon: "🎮", description: "Top up your Steam wallet and buy any game.", tag: null },
  { id: 4, name: "Netflix Gift Card", category: "Streaming", price: 30, stock: 3, icon: "🎬", description: "Stream unlimited movies and TV series on Netflix.", tag: "LOW" },
  { id: 5, name: "Google Play Card", category: "Mobile", price: 10, stock: 19, icon: "📱", description: "Buy apps, games, movies & more on Google Play.", tag: null },
  { id: 6, name: "Xbox Game Pass", category: "Gaming", price: 45, stock: 5, icon: "🕹️", description: "Access 100+ games on Xbox and PC instantly.", tag: "SALE" },
  { id: 7, name: "Spotify Premium", category: "Streaming", price: 10, stock: 31, icon: "🎧", description: "Ad-free music streaming on any device.", tag: null },
  { id: 8, name: "PlayStation Store", category: "Gaming", price: 50, stock: 2, icon: "🎯", description: "Buy PS5 and PS4 games and exclusive content.", tag: "HOT" },
  { id: 9, name: "Roblox Robux", category: "Gaming", price: 25, stock: 45, icon: "🧱", description: "Get Robux to purchase upgrades for your avatar or special abilities.", tag: "HOT" },
  { id: 10, name: "Nintendo eShop", category: "Gaming", price: 35, stock: 12, icon: "🍄", description: "The perfect gift for anyone who loves to play on Nintendo Switch.", tag: null },
  { id: 11, name: "Hulu Subscription", category: "Streaming", price: 20, stock: 8, icon: "📺", description: "Watch premium TV shows and movies on Hulu.", tag: null },
  { id: 12, name: "Sephora Gift Card", category: "Shopping", price: 50, stock: 15, icon: "💄", description: "Shop top beauty brands at Sephora.", tag: "SALE" },
  { id: 13, name: "Starbucks Card", category: "Shopping", price: 15, stock: 60, icon: "☕", description: "Treat yourself to your favorite coffee and treats.", tag: null },
  { id: 14, name: "Airbnb Gift Card", category: "Shopping", price: 100, stock: 4, icon: "🏠", description: "Give the perfect getaway with an Airbnb gift card.", tag: null },
  { id: 15, name: "Uber Eats Card", category: "Shopping", price: 25, stock: 20, icon: "🍔", description: "Delicious food delivered to your door.", tag: "HOT" }
];

async function seed() {
  for (const product of INITIAL_PRODUCTS) {
    const { error } = await supabase.from('products').upsert([product]);
    if (error) console.error("Error inserting", product.name, error);
  }
  console.log("Seeded products");
}
seed();
