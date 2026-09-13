export const INITIAL_PRODUCTS = [
  { id: 1, name: "Amazon Gift Card", category: "Shopping", price: 25, stock: 14, icon: "🛒", description: "Shop millions of items instantly on Amazon. Works globally.", tag: "HOT" },
  { id: 2, name: "iTunes Gift Card", category: "Entertainment", price: 15, stock: 7, icon: "🎵", description: "Buy music, movies, apps and more from Apple.", tag: "SALE" },
  { id: 3, name: "Steam Wallet Code", category: "Gaming", price: 20, stock: 22, icon: "🎮", description: "Top up your Steam wallet and buy any game.", tag: null },
  { id: 4, name: "Netflix Gift Card", category: "Streaming", price: 30, stock: 3, icon: "🎬", description: "Stream unlimited movies and TV series on Netflix.", tag: "LOW" },
  { id: 5, name: "Google Play Card", category: "Mobile", price: 10, stock: 19, icon: "📱", description: "Buy apps, games, movies & more on Google Play.", tag: null },
  { id: 6, name: "Xbox Game Pass", category: "Gaming", price: 45, stock: 5, icon: "🕹️", description: "Access 100+ games on Xbox and PC instantly.", tag: "SALE" },
  { id: 7, name: "Spotify Premium", category: "Streaming", price: 10, stock: 31, icon: "🎧", description: "Ad-free music streaming on any device.", tag: null },
  { id: 8, name: "PlayStation Store", category: "Gaming", price: 50, stock: 2, icon: "🎯", description: "Buy PS5 and PS4 games and exclusive content.", tag: "HOT" },
];

export const INITIAL_CRYPTOS = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "₿", color: "#F7931A", address: "Enter your BTC address here", qr: null },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627EEA", address: "Enter your ETH address here", qr: null },
  { id: "usdt", name: "Tether USDT", symbol: "USDT", icon: "₮", color: "#26A17B", address: "Enter your USDT address here", qr: null },
  { id: "ltc", name: "Litecoin", symbol: "LTC", icon: "Ł", color: "#BFBBBB", address: "Enter your LTC address here", qr: null },
];

export const ADMIN_PASSWORD = "vaultcards2025";
export const TELEGRAM_LINK = "https://t.me/yourusername";
export const CATEGORIES = ["All", "Gaming", "Streaming", "Shopping", "Entertainment", "Mobile"];

export function generateOrderId() {
  return "VC-" + Math.floor(10000 + Math.random() * 90000);
}
