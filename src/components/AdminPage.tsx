import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ADMIN_PASSWORD } from '../constants';
import { Product, Crypto, Order, Review, UserRecord } from '../types';
import { supabase, OperationType, handleSupabaseError } from '../supabase';

interface AdminPageProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cryptos: Crypto[];
  setCryptos: React.Dispatch<React.SetStateAction<Crypto[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  onBack: () => void;
  secureMode: boolean;
  setSecureMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AdminPage: React.FC<AdminPageProps> = ({ products, setProducts, cryptos, setCryptos, reviews, setReviews, onBack, secureMode, setSecureMode }) => {
  const [isSupabaseAuth, setIsSupabaseAuth] = useState(false);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [settings, setSettings] = useState({ telegramLink: "" });
  const [clickCount, setClickCount] = useState(0);
  const [secureSettings, setSecureSettings] = useState({ threshold: 1500, wallets: {} as Record<string, string>, qrs: {} as Record<string, string> });
  const [localSecureWallets, setLocalSecureWallets] = useState<Record<string, string>>({});
  const [localThreshold, setLocalThreshold] = useState<string>("1500");
  const [newSecureWallet, setNewSecureWallet] = useState({ id: "", address: "", qr: null as string | null });
  const [saved, setSaved] = useState<string | null>(null);
  const [newProd, setNewProd] = useState({ name: "", category: "Shopping", price: "", stock: "", icon: "🎁", description: "", tag: "" });
  const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "", avatar: "" });
  const [newCrypto, setNewCrypto] = useState({ name: "", symbol: "", icon: "₿", color: "#F7931A", address: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const fileRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Fetch initial data
  useEffect(() => {
    if (!isSupabaseAuth) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*').order('timestamp', { ascending: false });
      if (error) handleSupabaseError(error, OperationType.GET, 'orders');
      else setOrders(data as Order[]);
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*');
      if (error) handleSupabaseError(error, OperationType.GET, 'users');
      else setUsers(data as any[]); // Using any here to bypass exact match of UID vs uid for now
    };

    const fetchSettings = async () => {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'general').single();
      if (error && error.code !== 'PGRST116') handleSupabaseError(error, OperationType.GET, 'settings');
      else if (data) setSettings({ telegramLink: data.telegramlink });
    };

    fetchOrders();
    fetchUsers();
    fetchSettings();

    const orderSub = supabase.channel('orders-admin-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();
      
    const userSub = supabase.channel('users-admin-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(orderSub);
      supabase.removeChannel(userSub);
    };
  }, [isSupabaseAuth]);

  
  const handleDeleteUser = async (uid: string, email: string) => {
    if (!window.confirm(`Are you sure you want to completely delete user ${email}?`)) return;
    
    try {
      const res = await fetch(`/api/users/${uid}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!res.ok) {
        alert("Failed to delete user: " + (data.error || "Unknown error"));
        return;
      }
      
      // Update UI
      setUsers(prev => prev.filter(u => u.uid !== uid));
    } catch (err) {
      alert("Error deleting user: " + err);
    }
  };

  // Sync secure settings from Supabase

  useEffect(() => {
    if (!isSupabaseAuth || !secureMode) return;
    
    const fetchSecureSettings = async () => {
      const { data, error } = await supabase.from('secure_settings').select('*').eq('id', 'secure').single();
      if (error && error.code !== 'PGRST116') {
        handleSupabaseError(error, OperationType.GET, 'secure_settings');
      } else if (data) {
        setSecureSettings({
          threshold: Number(data.threshold) || 1500,
          wallets: data.wallets || {},
          qrs: data.qrs || {}
        });
        setLocalSecureWallets(data.wallets || {});
        setLocalThreshold(String(data.threshold || 1500));
      }
    };
    fetchSecureSettings();

    const secureSub = supabase.channel('secure-settings-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'secure_settings' }, fetchSecureSettings)
      .subscribe();

    return () => {
      supabase.removeChannel(secureSub);
    };
  }, [isSupabaseAuth, secureMode]);

  // Handle Admin Auth Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session.user.email === "godshandudoh@gmail.com") {
        setIsSupabaseAuth(true);
        setAuthEmail(session.user.email);
      } else {
        setIsSupabaseAuth(false);
        setAuthEmail(null);
      }
    });
  }, []);

  const saveMsg = (msg: string) => { 
    setSaved(msg); 
    setTimeout(() => setSaved(null), 2500); 
  };
  
  const updateProductLocal = (id: number, field: keyof Product, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateProductDB = async (id: number, field: keyof Product, value: any) => {
    try {
      const existing = products.find(p => p.id === id);
      if (!existing) return;
      const { error } = await supabase.from('products').upsert({ ...existing, [field]: value });
      if (error) throw error;
      saveMsg("✅ Saved!");
    } catch (e) { 
      handleSupabaseError(e, OperationType.WRITE, `products/${id}`);
    }
  };
  
  const deleteProduct = async (id: number) => { 
    try {
      setProducts(products.filter(p => p.id !== id));
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      saveMsg("Product deleted."); 
    } catch (e) { 
      handleSupabaseError(e, OperationType.DELETE, `products/${id}`);
    }
  };
  
  const addProduct = async () => {
    if (!newProd.name || !newProd.price || !newProd.stock) { 
      saveMsg("❌ Fill in name, price and stock."); 
      return; 
    }
    const id = Date.now();
    const p = { 
      ...newProd, 
      id, 
      price: Number(newProd.price), 
      stock: Number(newProd.stock), 
      tag: newProd.tag || null 
    };
    try {
      setProducts([...products, p as any]);
      const { error } = await supabase.from('products').insert([p]);
      if (error) throw error;
      setNewProd({ name: "", category: "Shopping", price: "", stock: "", icon: "🎁", description: "", tag: "" });
      saveMsg("✅ Product added!");
    } catch (e) { 
      handleSupabaseError(e, OperationType.WRITE, `products/${id}`);
    }
  };
  
  const updateCryptoField = async (id: string, field: keyof Crypto, value: string | null) => {
    try {
      const existing = cryptos.find(c => c.id === id);
      if (!existing) return;
      setCryptos(cryptos.map(c => c.id === id ? { ...c, [field]: value } : c));
      const { error } = await supabase.from('cryptos').upsert({ ...existing, [field]: value });
      if (error) throw error;
    } catch (e) { 
      handleSupabaseError(e, OperationType.WRITE, `cryptos/${id}`);
    }
  };

  const addCrypto = async () => {
    if (!newCrypto.name || !newCrypto.symbol || !newCrypto.address) {
      saveMsg("❌ Fill in name, symbol and address.");
      return;
    }
    const id = newCrypto.symbol.toLowerCase();
    try {
      setCryptos([...cryptos, { ...newCrypto, id, qr: null }]);
      const { error } = await supabase.from('cryptos').insert([{ ...newCrypto, id, qr: null }]);
      if (error) throw error;
      setNewCrypto({ name: "", symbol: "", icon: "₿", color: "#F7931A", address: "" });
      saveMsg("✅ Crypto added!");
    } catch (e) { 
      handleSupabaseError(e, OperationType.WRITE, `cryptos/${id}`);
    }
  };

  const deleteCrypto = async (id: string) => {
    try {
      setCryptos(cryptos.filter(c => c.id !== id));
      const { error } = await supabase.from('cryptos').delete().eq('id', id);
      if (error) throw error;
      saveMsg("Crypto deleted.");
    } catch (e) { 
      handleSupabaseError(e, OperationType.DELETE, `cryptos/${id}`);
    }
  };
  
  const handleQRUpload = (id: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async e => { 
      await updateCryptoField(id, "qr", e.target?.result as string);
      saveMsg("✅ QR code uploaded!"); 
    };
    reader.readAsDataURL(file);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], email: string, productName: string) => {
    try {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) throw error;
      saveMsg(`Order ${status}`);
      
      // Ping the backend to send the status update email to the customer
      fetch("/api/send-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, orderId, productName, status })
      }).catch(err => console.error("Update Email API failed", err));
    } catch (e) { 
      handleSupabaseError(e, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const addReview = async () => {
    if (!newReview.name || !newReview.text) {
      saveMsg("❌ Fill in name and text.");
      return;
    }
    const id = Date.now().toString();
    const r = {
      ...newReview,
      id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    try {
      setReviews([...reviews, r as any]);
      const { error } = await supabase.from('reviews').insert([r]);
      if (error) throw error;
      setNewReview({ name: "", rating: 5, text: "", avatar: "" });
      saveMsg("✅ Review added!");
    } catch (e) { 
      handleSupabaseError(e, OperationType.WRITE, `reviews/${id}`);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      setReviews(reviews.filter(r => r.id !== id));
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      saveMsg("Review deleted.");
    } catch (e) { 
      handleSupabaseError(e, OperationType.DELETE, `reviews/${id}`);
    }
  };

  const updateSettings = async () => {
    try {
      const { error } = await supabase.from('settings').upsert({ id: 'general', telegramlink: settings.telegramLink });
      if (error) throw error;
      saveMsg("✅ Settings updated!");
    } catch (e) {
      handleSupabaseError(e, OperationType.WRITE, "settings/general");
    }
  };

  const updateSecureSettings = async (field: string, value: any) => {
    try {
      const newSettings = { ...secureSettings, [field]: value };
      const { error } = await supabase.from('secure_settings').upsert({ id: 'secure', ...newSettings });
      if (error) throw error;
      setSecureSettings(newSettings);
    } catch (e) {
      handleSupabaseError(e, OperationType.WRITE, "settings/secure");
    }
  };

  const saveSecureThreshold = async () => {
    const num = Number(localThreshold);
    if (isNaN(num)) return;
    await updateSecureSettings("threshold", num);
    saveMsg("✅ Threshold updated!");
  };

  const saveSecureWallet = async (cryptoId: string) => {
    const address = localSecureWallets[cryptoId] || "";
    const newWallets = { ...secureSettings.wallets, [cryptoId]: address };
    await updateSecureSettings("wallets", newWallets);
    saveMsg(`✅ ${cryptoId.toUpperCase()} address saved!`);
  };

  const updateSecureQR = async (cryptoId: string, qr: string | null) => {
    const newQRs = { ...secureSettings.qrs, [cryptoId]: qr };
    await updateSecureSettings("qrs", newQRs);
  };

  const handleSecureQRUpload = (id: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async e => { 
      await updateSecureQR(id, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSecretTrigger = () => {
    setClickCount(prev => {
      if (prev + 1 >= 5) {
        setSecureMode(!secureMode);
        saveMsg(secureMode ? "🔒 Secure Mode Disabled" : "🔓 Secure Mode Enabled");
        return 0;
      }
      return prev + 1;
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.email.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isSupabaseAuth) return (
    <div className="max-w-[440px] mx-auto mt-24 px-5">
      <button 
        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6A7090] hover:text-[#D4AF37] transition-colors mb-8" 
        onClick={onBack}
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
        Return to Store
      </button>
      
        <div className="card p-12 text-center relative overflow-hidden">
          <div className="text-5xl mb-6">🚫</div>
          <h2 className="text-2xl font-bold mb-3 text-white">Access Restricted</h2>
          <p className="text-sm text-[#6A7090] mb-8 leading-relaxed">
            The account <span className="text-[#C9A84C] font-bold">{authEmail}</span> does not have admin permissions.
          </p>
          <button 
            className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-xl text-[11px] font-bold tracking-widest transition-all text-white uppercase" 
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-5 pb-24 pt-10">
      <AnimatePresence mode="wait">
        {saved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 bg-[#C9A84C] text-[#080A0F] px-6 py-3.5 rounded-2xl font-bold text-[11px] tracking-widest uppercase z-[999] shadow-lg"
          >
            {saved}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#C9A84C] flex items-center justify-center text-xl sm:text-2xl shadow-lg">
            {secureMode ? "🔓" : "⚡"}
          </div>
          <div>
            <h1 
              className="text-xl sm:text-2xl font-bold text-white tracking-tight cursor-pointer select-none"
              onClick={handleSecretTrigger}
            >
              Admin Dashboard {secureMode && <span className="text-[#00E676] text-[10px] ml-2 px-2 py-0.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/20 font-black uppercase tracking-widest">SECURE MODE</span>}
            </h1>
            <div className="text-[9px] sm:text-[10px] text-[#C9A84C] font-bold tracking-widest uppercase mt-1">Administrator: {authEmail}</div>
          </div>
        </div>
        <button 
          className="btn-outline px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-widest uppercase" 
          onClick={onBack}
        >
          ← Back to Store
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Inventory Assets", value: products.length, icon: "📦", color: "#D4AF37" }, 
          { label: "Pending Orders", value: orders.filter(o => o.status === 'pending').length, icon: "⏳", color: "#FFB347" }, 
          { label: "Gross Revenue", value: `$${orders.filter(o => o.status === 'completed').reduce((a, o) => a + o.total, 0).toLocaleString()}`, icon: "💰", color: "#00E676" }, 
          { label: "Client Feedback", value: reviews.length, icon: "⭐", color: "#4FC3F7" }
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={`stat-${i}`} 
            className="card p-6 border-l-4"
            style={{ borderLeftColor: s.color }}
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 mb-10 bg-white/2 border border-white/5 rounded-2xl p-1.5 w-fit flex-wrap">
        {[
          ["orders", "Orders"], 
          ["products", "Inventory"], 
          ["crypto", "Wallets"], 
          ["reviews", "Reviews"],
          ["users", "Users"],
          ["settings", "Settings"],
          ...(secureMode ? [["secure", "Secure Routing"]] : []),
          ["add", "New Asset"]
        ].map(([k, l]) => (
          <button 
            key={k} 
            className={`px-6 py-3 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all ${
              tab === k 
                ? "bg-[#C9A84C] text-[#080A0F]" 
                : "text-[#6A7090] hover:text-white hover:bg-white/5"
            }`} 
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "secure" && secureMode && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-10"
        >
          {/* Secure Header */}
          <div className="card p-10 border-2 border-[#00E676]/30 bg-[#00E676]/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="text-[10px] font-black text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/20 uppercase tracking-widest">
                SECURE ENVIRONMENT
              </div>
            </div>
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 rounded-[24px] bg-[#00E676] flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(0,230,118,0.3)]">
                🔒
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Secure Routing Control</h2>
                <p className="text-[#6A7090] text-sm mt-1">Configure high-value transaction overrides and thresholds.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[11px] text-[#00E676] font-bold tracking-[0.2em] uppercase ml-1">Order Value Threshold</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-[#00E676] font-black">$</span>
                  <input 
                    type="number"
                    className="admin-input pl-12 pr-32 py-5 bg-black/40 border-[#00E676]/30 text-[#00E676] text-3xl font-black rounded-2xl focus:border-[#00E676] transition-all"
                    value={localThreshold}
                    onChange={e => setLocalThreshold(e.target.value)}
                  />
                  <button 
                    onClick={saveSecureThreshold}
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#00E676] text-black text-[10px] font-black rounded-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                  >
                    Save
                  </button>
                </div>
                <p className="text-[10px] text-[#5A607A] italic ml-1">Orders equal to or above this amount will use the secure wallets below.</p>
              </div>
              <div className="bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col justify-center">
                <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase mb-3">CURRENT STATUS</div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#00E676] animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
                  <div className="text-white font-bold">Secure Routing Active</div>
                </div>
                <div className="text-[11px] text-[#5A607A] mt-2">All transactions over <span className="text-white font-bold">${secureSettings.threshold}</span> are being rerouted.</div>
              </div>
            </div>
          </div>

          {/* Secure Wallets List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Private Secure Wallets</h3>
              <div className="text-[10px] text-[#6A7090] font-bold uppercase tracking-widest">Total: {Object.keys(secureSettings.wallets).length}</div>
            </div>

            <div className="grid gap-4">
              {cryptos.map((c, i) => {
                const secureAddress = secureSettings.wallets[c.id];
                const secureQR = secureSettings.qrs[c.id];
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={c.id} 
                    className={`card p-8 border-l-4 transition-all ${secureAddress ? "border-[#00E676] bg-[#00E676]/[0.02]" : "border-white/10 opacity-60"}`}
                  >
                    <div className="flex gap-10 items-start flex-wrap lg:flex-nowrap">
                      <div className="flex items-center gap-6 min-w-[200px]">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg" style={{ background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color }}>{c.icon}</div>
                        <div>
                          <div className="font-bold text-xl text-white">{c.symbol}</div>
                          <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase mt-1">{c.name}</div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-[300px] space-y-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Current Public Address (Normal Routing)</label>
                          <div className="bg-white/5 border border-white/10 rounded-xl py-3 px-5 font-mono text-xs text-[#6A7090] break-all">
                            {c.address}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-[#00E676] font-bold tracking-widest uppercase ml-1">Private Secure Address (High-Value Routing)</label>
                          <div className="relative group">
                            <input 
                              className="admin-input py-4 px-5 pr-24 rounded-xl bg-black/40 border-[#00E676]/20 focus:border-[#00E676] transition-all font-mono text-sm text-[#00E676]" 
                              placeholder={`Enter private ${c.symbol} address...`}
                              value={localSecureWallets[c.id] || ""} 
                              onChange={e => setLocalSecureWallets(prev => ({ ...prev, [c.id]: e.target.value }))} 
                            />
                            {localSecureWallets[c.id] !== secureSettings.wallets[c.id] && (
                              <button 
                                onClick={() => saveSecureWallet(c.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#00E676] text-black text-[9px] font-black rounded-md uppercase tracking-widest hover:scale-105 transition-all"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        </div>
                        {secureAddress && localSecureWallets[c.id] === secureSettings.wallets[c.id] && (
                          <div className="flex items-center gap-2 text-[10px] text-[#00E676]/60 font-bold uppercase tracking-widest ml-1">
                            <span>🛡️ Routing Active for {c.symbol}</span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-[220px] text-center space-y-3">
                        <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase">Secure QR Code</label>
                        {secureQR ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="bg-white p-2 rounded-xl shadow-2xl border-2 border-[#00E676]">
                              <img src={secureQR} alt="Secure QR" className="w-[120px] h-[120px] block object-contain" />
                            </div>
                            <button className="text-[10px] text-red-400 font-bold tracking-widest uppercase hover:text-red-300 transition-colors" onClick={() => updateSecureQR(c.id, null)}>Remove Secure QR</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-full h-32 rounded-xl border-2 border-dashed border-[#00E676]/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#00E676] hover:bg-[#00E676]/5 transition-all group" 
                              onClick={() => fileRefs.current[`secure-${c.id}`]?.click()}
                            >
                              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔒</div>
                              <div className="text-[10px] text-[#00E676] font-bold tracking-widest uppercase">Upload Secure QR</div>
                            </div>
                            <input 
                              ref={el => { fileRefs.current[`secure-${c.id}`] = el; }} 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={e => handleSecureQRUpload(c.id, e.target.files ? e.target.files[0] : null)} 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {tab === "users" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between items-center px-2">
            <div>
              <h2 className="text-lg font-bold text-white">User Management</h2>
              <p className="text-xs text-[#6A7090]">Monitoring active sessions and registration data</p>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase bg-[#C9A84C]/10 px-4 py-2 rounded-full border border-[#C9A84C]/20">
              {users.length} Users
            </div>
          </div>
          <div className="grid gap-4">
            {users.sort((a, b) => b.lastActive - a.lastActive).map((u, i) => {
              const isActive = Date.now() - u.lastActive < 300000;
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={u.uid} 
                  className="card p-6 flex items-center justify-between flex-wrap gap-6 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                        👤
                      </div>
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00E676] rounded-full border-[3px] border-[#0D1017] shadow-[0_0_15px_rgba(0,230,118,0.5)]" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-bold text-white flex items-center gap-3">
                        {u.email}

                        {isActive && (
                          <span className="text-[9px] bg-[#00E676]/10 text-[#00E676] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-[#00E676]/20">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#5A607A] font-mono mt-1 tracking-wider uppercase">{u.uid}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleDeleteUser(u.uid, u.email)}
                      className="text-[9px] bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest font-bold border border-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="flex gap-10 flex-wrap w-full md:w-auto mt-4 md:mt-0">

                    <div className="space-y-1">
                      <div className="text-[9px] text-[#5A607A] font-bold uppercase tracking-[0.2em]">Orders</div>
                      <div className="text-xs text-[#C9A84C] font-bold">{orders.filter(o => o.email === u.email).length}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-[#5A607A] font-bold uppercase tracking-[0.2em]">Created</div>
                      <div className="text-xs text-white font-medium">{new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-[#5A607A] font-bold uppercase tracking-[0.2em]">Last Login</div>
                      <div className="text-xs text-white font-medium">{new Date(u.lastLogin).toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-[#5A607A] font-bold uppercase tracking-[0.2em]">Last Activity</div>
                      <div className="text-xs text-white font-medium">{isActive ? "Online" : new Date(u.lastActive).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Orders list for this user */}
                  {orders.filter(o => o.email === u.email).length > 0 && (
                    <div className="w-full mt-6 pt-6 border-t border-white/5">
                      <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase mb-4">Transaction History</div>
                      <div className="grid gap-3">
                        {orders.filter(o => o.email === u.email).map(o => {
                          const product = products.find(p => p.id === o.productId);
                          return (
                            <div key={o.id} className="flex items-center justify-between bg-white/[0.02] p-4 rounded-xl border border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="text-xl">{product?.icon || '📦'}</div>
                                <div>
                                  <div className="text-sm font-bold text-white">{o.productName}</div>
                                  <div className="text-[10px] text-[#5A607A] mt-0.5">{new Date(o.timestamp).toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <div className="text-sm font-bold text-white">${o.total}</div>
                                  <div className="text-[9px] text-[#C9A84C] font-bold uppercase tracking-widest">{o.cryptoSymbol}</div>
                                </div>
                                <div className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border ${
                                  o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  o.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                  {o.status}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {tab === "orders" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-6"
        >
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6A7090]">🔍</span>
              <input 
                className="admin-input pl-12 py-4 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="admin-input w-[200px] cursor-pointer py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col gap-4">
            {filteredOrders.length === 0 && (
              <div className="text-center py-32 card bg-white/[0.01]">
                <div className="text-4xl mb-4 opacity-20">📂</div>
                <div className="text-[#5A607A] font-medium">No transactions found matching your criteria.</div>
              </div>
            )}
            {filteredOrders.map((o, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={o.id} 
                className="card p-6 flex flex-wrap gap-8 items-center justify-between hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex gap-5 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-2xl">
                    🛒
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{o.productName} <span className="text-[#6A7090] font-light ml-1">× {o.qty}</span></div>
                    <div className="text-[10px] text-[#C9A84C] font-mono mt-1 tracking-wider uppercase">{o.id}</div>
                    <div className="text-[10px] text-[#5A607A] mt-1 font-medium">{new Date(o.timestamp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="min-w-[200px]">
                  <div className="text-[9px] text-[#5A607A] mb-1.5 font-bold tracking-widest uppercase">Customer</div>
                  <div className="text-sm text-white font-medium">{o.email}</div>
                </div>
                <div className="text-right md:text-left">
                  <div className="text-2xl font-bold text-[#C9A84C]">${o.total.toLocaleString()}</div>
                  <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase mt-1">{o.cryptoSymbol} Payment</div>
                </div>
                <div className="flex gap-3">
                  {o.status === 'pending' && (
                    <>
                      <button 
                        className="bg-[#00E676] hover:bg-[#00C853] text-[#0D1017] px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg" 
                        onClick={() => updateOrderStatus(o.id, 'completed', o.email, o.productName)}
                      >
                        Complete
                      </button>
                      <button 
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all" 
                        onClick={() => updateOrderStatus(o.id, 'cancelled', o.email, o.productName)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <div className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase border ${
                    o.status === 'completed' ? 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/20' : 
                    o.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    'bg-[#FFB347]/10 text-[#FFB347] border-[#FFB347]/20'
                  }`}>
                    {o.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === "products" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-[11px] text-[#6A7090] mb-6 font-bold tracking-widest uppercase ml-2">Inventory Management</div>
          <div className="flex flex-col gap-4">
            {products.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={p.id} 
                className="card p-6 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex gap-6 items-end flex-wrap">
                  <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-3xl shrink-0">{p.icon}</div>
                  <div className="flex-[2] min-w-[200px] space-y-2">
                    <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase">Product Name</label>
                    <input className="admin-input py-3 px-4 rounded-xl bg-white/5 border-white/10 focus:border-[#C9A84C]/30 transition-all" value={p.name} onChange={e => updateProductLocal(p.id, "name", e.target.value)} onBlur={e => updateProductDB(p.id, "name", e.target.value)} />
                  </div>
                  <div className="flex-1 min-w-[150px] space-y-2">
                    <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase">Category</label>
                    <input 
                      type="text"
                      className="admin-input py-3 px-4 rounded-xl bg-white/5 border-white/10 focus:border-[#C9A84C]/30 transition-all" 
                      value={p.category} 
                      onChange={e => updateProductLocal(p.id, "category", e.target.value)}
                      onBlur={e => updateProductDB(p.id, "category", e.target.value)}
                      list="category-options"
                    />
                  </div>
                  <div className="min-w-[100px] space-y-2">
                    <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase">Price ($)</label>
                    <input className="admin-input py-3 px-4 rounded-xl bg-white/5 border-white/10 focus:border-[#C9A84C]/30 transition-all" type="number" value={p.price} onChange={e => updateProductLocal(p.id, "price", Number(e.target.value))} onBlur={e => updateProductDB(p.id, "price", Number(e.target.value))} />
                  </div>
                  <div className="min-w-[100px] space-y-2">
                    <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase">Stock</label>
                    <input className="admin-input py-3 px-4 rounded-xl bg-white/5 border-white/10 focus:border-[#C9A84C]/30 transition-all" type="number" value={p.stock} onChange={e => updateProductLocal(p.id, "stock", Number(e.target.value))} onBlur={e => updateProductDB(p.id, "stock", Number(e.target.value))} />
                  </div>
                  <div className="min-w-[100px] space-y-2">
                    <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase">Tag</label>
                    <select className="admin-input py-3 px-4 rounded-xl bg-white/5 border-white/10 focus:border-[#C9A84C]/30 transition-all cursor-pointer" value={p.tag || ""} onChange={e => { updateProductLocal(p.id, "tag", e.target.value || null); updateProductDB(p.id, "tag", e.target.value || null); }}>
                      {["", "HOT", "SALE", "LOW"].map(t => <option key={t} value={t}>{t || "None"}</option>)}
                    </select>
                  </div>
                  <button 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shrink-0" 
                    onClick={() => deleteProduct(p.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-6 space-y-2">
                  <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase ml-1">Description</label>
                  <input className="admin-input py-3 px-4 rounded-xl bg-white/5 border-white/10 focus:border-[#C9A84C]/30 transition-all" value={p.description} onChange={e => updateProductLocal(p.id, "description", e.target.value)} onBlur={e => updateProductDB(p.id, "description", e.target.value)} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === "crypto" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-8"
        >
        <div className="card p-10 relative overflow-hidden">
          <h3 className="text-xl font-bold mb-8 text-white">Register New Wallet</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Asset Name</label>
              <input className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" placeholder="e.g. Bitcoin" value={newCrypto.name} onChange={e => setNewCrypto(c => ({ ...c, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Symbol</label>
              <input className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" placeholder="e.g. BTC" value={newCrypto.symbol} onChange={e => setNewCrypto(c => ({ ...c, symbol: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Icon</label>
              <input className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" placeholder="₿" value={newCrypto.icon} onChange={e => setNewCrypto(c => ({ ...c, icon: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Brand Color</label>
              <input className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" placeholder="#F7931A" value={newCrypto.color} onChange={e => setNewCrypto(c => ({ ...c, color: e.target.value }))} />
            </div>
          </div>
          <div className="mb-8 space-y-2">
            <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Public Address</label>
            <input className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all font-mono text-sm" placeholder="Paste secure address here..." value={newCrypto.address} onChange={e => setNewCrypto(c => ({ ...c, address: e.target.value }))} />
          </div>
          <button className="btn-gold px-10 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase" onClick={addCrypto}>Add Wallet</button>
        </div>

          <div className="text-[11px] text-[#6A7090] mb-2 font-bold tracking-widest uppercase ml-2">Active Wallets</div>
          <div className="grid gap-4">
            {cryptos.map((c, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={c.id} 
                className="card p-8 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex gap-8 items-start flex-wrap lg:flex-nowrap">
                  <div className="flex items-center gap-5 min-w-[180px]">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-lg" style={{ background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color }}>{c.icon}</div>
                    <div>
                      <div className="font-bold text-xl text-white">{c.symbol}</div>
                      <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase mt-1">{c.name}</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[300px] space-y-2">
                    <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase ml-1">Wallet Address</label>
                    <input className="admin-input py-3 px-4 rounded-xl bg-white/5 border-white/10 focus:border-[#C9A84C]/30 transition-all font-mono text-xs" value={c.address} onChange={e => updateCryptoField(c.id, "address", e.target.value)} onBlur={() => saveMsg("✅ Address saved!")} />
                  </div>
                  <div className="min-w-[220px] text-center space-y-3">
                    <label className="text-[9px] text-[#5A607A] font-bold tracking-widest uppercase">QR Code</label>
                    {c.qr ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-xl">
                          <img src={c.qr} alt="QR" className="w-[120px] h-[120px] block object-contain" />
                        </div>
                        <button className="text-[10px] text-red-400 font-bold tracking-widest uppercase hover:text-red-300 transition-colors" onClick={() => { updateCryptoField(c.id, "qr", null); saveMsg("QR removed."); }}>Replace Image</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A84C]/30 hover:bg-white/2 transition-all group" 
                          onClick={() => fileRefs.current[c.id]?.click()}
                        >
                          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                          <div className="text-[10px] text-[#C9A84C] font-bold tracking-widest uppercase">Upload QR</div>
                        </div>
                        <input 
                          ref={el => { fileRefs.current[c.id] = el; }} 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={e => handleQRUpload(c.id, e.target.files ? e.target.files[0] : null)} 
                        />
                      </div>
                    )}
                  </div>
                  <button 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all self-end" 
                    onClick={() => deleteCrypto(c.id)}
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === "reviews" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-8"
        >
          <div className="card p-10 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-8 text-white">Add Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Client Name</label>
                <input className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" placeholder="e.g. Alexander Pierce" value={newReview.name} onChange={e => setNewReview(r => ({ ...r, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Rating</label>
                <select className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all cursor-pointer" value={newReview.rating} onChange={e => setNewReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Avatar URL</label>
                <input className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" placeholder="https://..." value={newReview.avatar} onChange={e => setNewReview(r => ({ ...r, avatar: e.target.value }))} />
              </div>
            </div>
            <div className="mb-8 space-y-2">
              <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Review Content</label>
              <textarea className="admin-input py-4 px-5 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all min-h-[100px] resize-none" placeholder="Share the client's experience..." value={newReview.text} onChange={e => setNewReview(r => ({ ...r, text: e.target.value }))} />
            </div>
            <button className="btn-gold px-10 py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase" onClick={addReview}>Add Review</button>
          </div>

          <div className="text-[11px] text-[#6A7090] mb-2 font-bold tracking-widest uppercase ml-2">Client Testimonials</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={r.id} 
                className="card p-8 hover:bg-white/[0.03] transition-colors relative group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl overflow-hidden shrink-0">
                      {r.avatar ? <img src={r.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" /> : "👤"}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white leading-tight">{r.name}</div>
                      <div className="flex gap-1 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={`star-${r.id}-${i}`} className={`text-[10px] ${i < r.rating ? 'text-[#C9A84C]' : 'text-white/10'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-[10px] font-bold tracking-widest uppercase" 
                    onClick={() => deleteReview(r.id)}
                  >
                    Remove
                  </button>
                </div>
                <p className="text-[#6A7090] text-sm leading-relaxed italic">"{r.text}"</p>
                <div className="text-[9px] text-[#5A607A] font-bold tracking-[0.2em] uppercase mt-6">{r.date}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === "settings" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl">
                ⚙️
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">General Settings</h2>
                <p className="text-[10px] text-[#6A7090] uppercase tracking-widest font-bold mt-1">Configure your store portal</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Telegram Contact Link</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.36-.49.99-.75 3.88-1.69 6.46-2.8 7.74-3.33 3.69-1.54 4.45-1.81 4.95-1.81.11 0 .35.03.5.16.13.1.17.24.18.34.01.06.02.18.01.22z"/>
                    </svg>
                  </div>
                  <input 
                    className="admin-input pl-12 py-4" 
                    placeholder="https://t.me/yourusername" 
                    value={settings.telegramLink} 
                    onChange={e => setSettings(s => ({ ...s, telegramLink: e.target.value }))} 
                  />
                </div>
                <p className="text-[10px] text-[#5A607A] italic ml-1">This link will be used for the Telegram button on the homepage.</p>
              </div>

              <button 
                className="btn-gold w-full py-4 rounded-xl text-[11px] font-bold tracking-widest uppercase shadow-lg mt-4" 
                onClick={updateSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "add" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card p-12 relative overflow-hidden">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-3xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-4xl shadow-xl">
                {newProd.icon || '📦'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Add New Product</h2>
                <p className="text-[#6A7090] mt-1">Expanding the store inventory</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Product Name</label>
                <input className="admin-input py-4 px-6 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" placeholder="e.g. Netflix Premium" value={newProd.name} onChange={e => setNewProd(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Category</label>
                <input 
                  type="text"
                  className="admin-input py-4 px-6 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" 
                  value={newProd.category} 
                  onChange={e => setNewProd(p => ({ ...p, category: e.target.value }))}
                  list="category-options"
                  placeholder="e.g. Shopping"
                />
                <datalist id="category-options">
                  {Array.from(new Set(products.map(p => p.category))).map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Price (USD)</label>
                <input className="admin-input py-4 px-6 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" type="number" placeholder="0.00" value={newProd.price} onChange={e => setNewProd(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Stock</label>
                <input className="admin-input py-4 px-6 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all" type="number" placeholder="100" value={newProd.stock} onChange={e => setNewProd(p => ({ ...p, stock: e.target.value }))} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Icon (Emoji)</label>
                <input className="admin-input py-4 px-6 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all text-center text-2xl" placeholder="🎬" value={newProd.icon} onChange={e => setNewProd(p => ({ ...p, icon: e.target.value }))} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Tag</label>
                <select className="admin-input py-4 px-6 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all cursor-pointer" value={newProd.tag || ""} onChange={e => setNewProd(p => ({ ...p, tag: e.target.value || null }))}>
                  <option value="">No Tag</option>
                  <option value="HOT">🔥 HOT</option>
                  <option value="SALE">🏷️ SALE</option>
                  <option value="LOW">📉 LOW STOCK</option>
                </select>
              </div>
            </div>

            <div className="mb-12 space-y-3">
              <label className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase ml-1">Description</label>
              <textarea className="admin-input py-4 px-6 rounded-xl bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all min-h-[100px] resize-none" placeholder="Product details..." value={newProd.description} onChange={e => setNewProd(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="flex gap-4">
              <button className="btn-gold flex-1 py-5 rounded-xl text-[12px] font-bold tracking-[0.2em] uppercase shadow-lg" onClick={addProduct}>
                Add Product
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-xl text-[12px] font-bold tracking-[0.2em] uppercase transition-all" onClick={() => setTab('products')}>
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
