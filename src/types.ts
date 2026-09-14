export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  image?: string;
  rating?: number;
  description: string;
  tag: string | null;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  address: string;
  qr: string | null;
}

export interface Order {
  id: string;
  productId: number;
  productName: string;
  qty: number;
  total: number;
  cryptoSymbol: string;
  email: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface UserRecord {
  uid: string;
  email: string;
  lastLogin: number;
  lastActive: number;
  createdAt: number;
}

export interface AppSettings {
  telegramLink: string;
}
