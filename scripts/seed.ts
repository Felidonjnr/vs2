import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lddelqtdfmjnzlwzylzz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZGVscXRkZm1qbnpsd3p5bHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyNzgwMjMsImV4cCI6MjEwNDg1NDAyM30.mX3TsDOOD30oWaVczgzmraft3CNGASsJdarCVntWSBs';

const supabase = createClient(supabaseUrl, supabaseKey);

const INITIAL_PRODUCTS = [
  { id: 1, name: "Amazon Gift Card", category: "Shopping", price: 25, stock: 14, icon: "🛒", description: "Shop millions of items instantly on Amazon. Works globally.", tag: "HOT" },
  { id: 2, name: "iTunes Gift Card", category: "Entertainment", price: 15, stock: 7, icon: "🎵", description: "Buy music, movies, apps and more from Apple.", tag: "SALE" },
  { id: 3, name: "Steam Wallet Code", category: "Gaming", price: 20, stock: 22, icon: "🎮", description: "Top up your Steam wallet and buy any game.", tag: null },
  { id: 4, name: "Netflix Gift Card", category: "Streaming", price: 30, stock: 3, icon: "🎬", description: "Stream unlimited movies and TV series on Netflix.", tag: "LOW" },
  { id: 5, name: "Google Play Card", category: "Mobile", price: 10, stock: 19, icon: "📱", description: "Buy apps, games, movies & more on Google Play.", tag: null },
  { id: 6, name: "Xbox Game Pass", category: "Gaming", price: 45, stock: 5, icon: "🕹️", description: "Access 100+ games on Xbox and PC instantly.", tag: "SALE" },
  { id: 7, name: "Spotify Premium", category: "Streaming", price: 10, stock: 31, icon: "🎧", description: "Ad-free music streaming on any device.", tag: null },
  { id: 8, name: "PlayStation Store", category: "Gaming", price: 50, stock: 2, icon: "🎯", description: "Buy PS5 and PS4 games and exclusive content.", tag: "HOT" }
];

const INITIAL_CRYPTOS = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿", color: "#F7931A", address: "Enter your BTC address here", qr: null },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627EEA", address: "Enter your ETH address here", qr: null },
  { id: "usdt", name: "Tether USDT", symbol: "USDT", icon: "₮", color: "#26A17B", address: "Enter your USDT address here", qr: null },
  { id: "ltc", name: "Litecoin", symbol: "LTC", icon: "Ł", color: "#BFBBBB", address: "Enter your LTC address here", qr: null }
];

const INITIAL_SETTINGS = { id: 'general', telegramlink: 'https://t.me/yourusername' };
const INITIAL_SECURE_SETTINGS = { id: 'secure', threshold: 1500, wallets: {}, qrs: {} };

async function seedDatabase() {
  console.log("Seeding Supabase Database...");

  try {
    // We cannot create tables via the Supabase Data API, but we can attempt to insert
    // If the table doesn't exist, this script will fail, and we'll tell the user to run the SQL in their dashboard.

    console.log("Inserting products...");
    const { error: prodErr } = await supabase.from('products').upsert(INITIAL_PRODUCTS);
    if (prodErr) throw prodErr;

    console.log("Inserting cryptos...");
    const { error: crypErr } = await supabase.from('cryptos').upsert(INITIAL_CRYPTOS);
    if (crypErr) throw crypErr;

    console.log("Inserting settings...");
    const { error: setErr } = await supabase.from('settings').upsert([INITIAL_SETTINGS]);
    if (setErr) throw setErr;

    console.log("Inserting secure settings...");
    const { error: secErr } = await supabase.from('secure_settings').upsert([INITIAL_SECURE_SETTINGS]);
    if (secErr) throw secErr;

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
