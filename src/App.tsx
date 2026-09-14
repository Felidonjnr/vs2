/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Nav } from "./components/Nav";
import { Ticker } from "./components/Ticker";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { ProductPage } from "./components/ProductPage";
import { PaymentPage } from "./components/PaymentPage";
import { ConfirmPage } from "./components/ConfirmPage";
import { CartPage } from "./components/CartPage";
import { AdminPage } from "./components/AdminPage";
import { AuthPage } from "./components/AuthPage";
import { INITIAL_PRODUCTS, INITIAL_CRYPTOS } from "./constants";
import { Product, Crypto, Order, Review, CartItem } from "./types";
import { supabase, OperationType, handleSupabaseError } from "./supabase";
import { User } from "@supabase/supabase-js";
import { TELEGRAM_LINK } from "./constants";

// Simulated stock logic: Fluctuates 4 times a day
const getSimulatedStock = (originalStock: number, productId: number) => {
  const now = new Date();
  const period = Math.floor(now.getHours() / 6); // 0, 1, 2, 3
  const day = now.getDate();
  const month = now.getMonth();
  
  // Deterministic "random" offset based on product ID, day, month, and period
  const seed = (productId * 13 + day * 7 + month * 3 + period * 5) % 10;
  const offset = (seed % 3) - 1; // -1, 0, or 1
  
  return Math.max(1, originalStock + offset);
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cryptos, setCryptos] = useState<Crypto[]>(INITIAL_CRYPTOS);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState({ telegramLink: TELEGRAM_LINK });
  const [secureMode, setSecureMode] = useState(false);
  
  // Track Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setHasRedirected(false);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update lastActive timestamp
  useEffect(() => {
    if (!user) return;
    
    const updateActivity = async () => {
      try {
        await supabase
          .from('users')
          .upsert({ uid: user.id, email: user.email, last_active: Date.now() });
      } catch (e) {
        // Silently fail activity tracking
      }
    };

    updateActivity();
    const interval = setInterval(updateActivity, 120000);
    updateActivity();

    return () => clearInterval(interval);
  }, [user, location.pathname]);

  // Sync products, cryptos, and reviews from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'general').single();
      if (data && data.telegramlink) {
        setSettings({ telegramLink: data.telegramlink });
      }
    };
    fetchSettings();

    const settingsSub = supabase.channel('settings-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchSettings)
      .subscribe();

    if (!user) {
      return () => {
        supabase.removeChannel(settingsSub);
      };
    }

    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) {
        const prods = data.map(doc => ({ ...doc, stock: getSimulatedStock(Number(doc.stock), doc.id) })) as Product[];
        setProducts(prods.length > 0 ? prods : INITIAL_PRODUCTS);
      }
    };

    const fetchCryptos = async () => {
      const { data } = await supabase.from('cryptos').select('*');
      if (data) {
        setCryptos(data.length > 0 ? (data as Crypto[]) : INITIAL_CRYPTOS);
      }
    };

    const fetchReviews = async () => {
      const { data } = await supabase.from('reviews').select('*');
      if (data) {
        setReviews(data as Review[]);
      }
    };

    fetchProducts();
    fetchCryptos();
    fetchReviews();

    const dataSub = supabase.channel('data-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchProducts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cryptos' }, fetchCryptos)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, fetchReviews)
      .subscribe();

    return () => {
      supabase.removeChannel(settingsSub);
      supabase.removeChannel(dataSub);
    };
  }, [user]);

  // Redirect admin directly to dashboard
  useEffect(() => {
    if (user && user.email === "godshandudoh@gmail.com" && location.pathname === "/" && !hasRedirected) {
      setHasRedirected(true);
      navigate("/admin");
    }
  }, [user, navigate, location.pathname, hasRedirected]);

  const isAdminPage = location.pathname === "/admin";

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080A0F] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C9A84C20] border-t-[#C9A84C] rounded-full animate-spin"></div>
      </div>
    );
  }

  const telegramButton = (
    <motion.a
      href={settings.telegramLink || TELEGRAM_LINK}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[9999] w-16 h-16 bg-[#26A5E4] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(38,165,228,0.4)] border-2 border-white/20"
    >
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.36-.49.99-.75 3.88-1.69 6.46-2.8 7.74-3.33 3.69-1.54 4.45-1.81 4.95-1.81.11 0 .35.03.5.16.13.1.17.24.18.34.01.06.02.18.01.22z"/>
      </svg>
    </motion.a>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080A0F] text-[#E8EAF0] font-sans">
        <Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} onCart={() => navigate("/cart")} cartItemCount={0} user={null} />
        <AuthPage />
        {telegramButton}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080A0F] text-[#E8EAF0] font-sans">
      <Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} onCart={() => navigate("/cart")} cartItemCount={cart.reduce((sum, item) => sum + item.qty, 0)} user={user} secureMode={secureMode} />
      {!isAdminPage && <Ticker />}
      
      <main>
        <Routes>
          <Route path="/" element={
            <HomePage 
              user={user}
              products={products} 
              reviews={reviews}
              settings={settings}
              onProduct={p => navigate(`/product/${p.id}`)} 
            />
          } />
          
          <Route path="/product/:id" element={<ProductPageRoute products={products} navigate={navigate} cart={cart} setCart={setCart} />} />
          
          <Route path="/cart" element={
            <CartPage 
              cart={cart}
              onUpdateQty={(id, qty) => setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))}
              onRemove={id => setCart(prev => prev.filter(i => i.product.id !== id))}
              onCheckout={() => navigate("/checkout")}
              onBack={() => navigate("/")}
            />
          } />
          
          <Route path="/checkout" element={<PaymentPageRoute cart={cart} cryptos={cryptos} navigate={navigate} setCart={setCart} />} />
          
          <Route path="/confirm/:orderId" element={<ConfirmPageRoute cart={cart} setCart={setCart} settings={settings} navigate={navigate} />} />
          
          <Route path="/admin" element={
            <AdminPage 
              products={products} 
              setProducts={setProducts} 
              cryptos={cryptos} 
              setCryptos={setCryptos} 
              reviews={reviews}
              setReviews={setReviews}
              onBack={() => navigate("/")} 
              secureMode={secureMode}
              setSecureMode={setSecureMode}
            />
          } />
        </Routes>
      </main>
      
      {!isAdminPage && <Footer />}
      {!isAdminPage && telegramButton}
    </div>
  );
}

function ProductPageRoute({ products, navigate, cart, setCart }: { products: Product[], navigate: any, cart: CartItem[], setCart: any }) {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  
  if (!product) return <div className="p-20 text-center">Product not found</div>;
  
  return (
    <ProductPage 
      product={product} 
      onBack={() => navigate("/")} 
      onAddToCart={(_p, q) => {
        setCart((prev: CartItem[]) => {
          const existing = prev.find(item => item.product.id === product.id);
          if (existing) {
            return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + q } : item);
          }
          return [...prev, { product: _p, qty: q }];
        });
        navigate("/cart");
      }} 
    />
  );
}

function PaymentPageRoute({ cart, cryptos, navigate, setCart }: { cart: CartItem[], cryptos: Crypto[], navigate: any, setCart: any }) {
  if (!cart || cart.length === 0) {
    navigate("/");
    return null;
  }
  
  const handlePaid = async (orderId: string, email: string, cryptoSymbol: string) => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const combinedName = cart.map(item => `${item.qty}x ${item.product.name}`).join(', ');
    
    const order = {
      id: orderId,
      productId: cart[0].product.id,
      productName: combinedName,
      qty: cart.reduce((sum, item) => sum + item.qty, 0),
      total: total,
      cryptoSymbol,
      email,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    try {
      const { error: dbError } = await supabase.from('orders').insert([order]);
      if (dbError) console.error("Database insert error:", dbError);
      
      fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          orderId,
          productName: combinedName,
          qty: order.qty,
          total: total,
          cryptoSymbol
        })
      }).catch(err => console.error("Email API failed", err));
      
      navigate(`/confirm/${orderId}`);
    } catch (e) {
      console.error("Failed to save order", e);
      navigate(`/confirm/${orderId}`);
    }
  };
  
  return (
    <PaymentPage 
      cart={cart}
      cryptos={cryptos || []}
      onBack={() => navigate("/cart")}
      onPaid={handlePaid}
    />
  );
}

function ConfirmPageRoute({ cart, setCart, settings, navigate }: { cart: CartItem[], setCart: any, settings: { telegramLink: string }, navigate: any }) {
  const { orderId } = useParams();
  
  if (!cart || cart.length === 0 || !orderId) {
    return <div className="p-20 text-center">Order not found or cart empty</div>;
  }
  
  return (
    <ConfirmPage 
      orderId={orderId}
      cart={cart}
      settings={settings}
      onHome={() => {
        setCart([]); // Clear cart after successful order!
        navigate("/");
      }}
    />
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
