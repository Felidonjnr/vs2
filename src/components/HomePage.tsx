import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../constants';
import { Product, Review } from '../types';
import { TELEGRAM_LINK } from '../constants';

interface HomePageProps {
  products: Product[];
  reviews: Review[];
  settings: { telegramLink: string };
  onProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, reviews, settings, onProduct }) => {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  
  const filtered = products.filter(p => 
    (cat === "All" || p.category === cat) && 
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const stockColor = (s: number) => s <= 3 ? "#FF4444" : s <= 7 ? "#FFB347" : "#00E676";

  const telegramLink = settings.telegramLink || TELEGRAM_LINK;

  return (
    <div className="max-w-[1400px] mx-auto px-6 pb-20">
      <div className="text-center py-24 pb-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(212,175,55,0.12)_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-5 py-1.5 rounded-full mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
          <span className="text-[10px] text-[#D4AF37] font-black tracking-[0.2em] uppercase">Marketplace Active</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-tight"
        >
          Digital Assets & <span className="text-[#C9A84C]">Vouchers</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[#9AA0B4] max-w-[600px] mx-auto mb-10 leading-relaxed"
        >
          Secure instant delivery on premium gift cards and digital assets. 
          Pay globally with crypto. 24/7 specialized support.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center flex-wrap mb-10"
        >
          {[`📦 ${products.length} Products`, "⚡ Instant Delivery", "🔒 Secure Escrow"].map((b, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-full px-6 py-2 text-[11px] text-[#9AA0B4] font-bold tracking-wider uppercase">{b}</div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <a 
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-10 py-4 rounded-full text-[12px] font-black tracking-[0.2em] uppercase shadow-[0_15px_35px_rgba(212,175,55,0.25)] flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.36-.49.99-.75 3.88-1.69 6.46-2.8 7.74-3.33 3.69-1.54 4.45-1.81 4.95-1.81.11 0 .35.03.5.16.13.1.17.24.18.34.01.06.02.18.01.22z"/>
            </svg>
            Contact Us
          </a>
        </motion.div>
      </div>

      <div className="flex items-center justify-between mb-8 flex-wrap gap-6 border-b border-white/5 pb-8">
        <h2 className="text-2xl font-bold text-white flex items-baseline gap-3">
          Collections
          <span className="text-xs text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-0.5 rounded-full font-bold">{filtered.length}</span>
        </h2>
        
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/5">
            {CATEGORIES.map(c => (
              <button 
                key={c} 
                className={`cat-btn ${cat === c ? "active" : ""}`} 
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A607A] text-sm group-focus-within:text-[#D4AF37] transition-colors">🔍</span>
            <input 
              className="input pl-11 pr-5 py-3 w-[240px] text-sm" 
              placeholder="Search assets..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              key={p.id} 
              className="product-card group" 
              onClick={() => onProduct(p)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">{p.icon}</div>
                  {p.tag && (
                    <div className={`tag ${p.tag === "HOT" ? "bg-gradient-to-br from-[#FF4D00] to-[#FF8A00] text-white" : p.tag === "SALE" ? "bg-[#D4AF37] text-[#05060A]" : "bg-red-600 text-white"}`}>
                      {p.tag === "LOW" ? "⚠ LOW" : p.tag}
                    </div>
                  )}
                </div>
                
                <div className="text-[10px] text-[#C9A84C] tracking-widest font-bold uppercase mb-2">{p.category}</div>
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#C9A84C] transition-colors">{p.name}</h3>
                <p className="text-sm text-[#9AA0B4] leading-relaxed mb-6 line-clamp-2">{p.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: stockColor(p.stock) }} />
                  <span className="text-[11px] font-bold uppercase" style={{ color: stockColor(p.stock) }}>
                    {p.stock <= 3 ? `Limited: ${p.stock} left` : `In Stock: ${p.stock}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#5A607A] uppercase font-bold tracking-widest mb-1">Price</span>
                    <span className="text-xl font-bold text-white">${p.price}</span>
                  </div>
                  <button className="btn-gold px-5 py-2.5 rounded-lg">Purchase</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 text-[#5A607A]"
        >
          <div className="text-6xl mb-6 opacity-20">🔍</div>
          <p className="text-lg font-light">No assets matching your criteria.</p>
        </motion.div>
      )}

      {reviews.length > 0 && (
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Client Testimonials</h2>
            <div className="w-16 h-1 bg-[#C9A84C] mx-auto rounded-full mb-6" />
            <p className="text-[#9AA0B4]">Verified feedback from our global community</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8">
            {reviews.map((r, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={r.id} 
                className="card p-8 relative group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-xl overflow-hidden border border-[#C9A84C]/20">
                    {r.avatar ? <img src={r.avatar} className="w-full h-full object-cover" alt="" /> : "👤"}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{r.name}</div>
                    <div className="flex text-[10px] text-[#C9A84C] mt-1">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
                  </div>
                </div>
                <p className="text-sm text-[#9AA0B4] leading-relaxed italic">"{r.text}"</p>
                <div className="text-[10px] text-[#5A607A] mt-6 font-mono tracking-widest uppercase">{r.date}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 pt-16 border-t border-white/5">
        {[
          { icon: "⚡", t: "Priority Support", d: "Direct access to our Telegram team" }, 
          { icon: "₿", t: "Global Liquidity", d: "Pay with BTC, ETH, USDT, or LTC" }, 
          { icon: "🔒", t: "Escrow Protection", d: "Secure unique order verification" }, 
          { icon: "✅", t: "Verified Trust", d: "Over 500+ successful deliveries" }
        ].map((b, i) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={i} 
            className="flex flex-col gap-4 bg-white/2 border border-white/5 rounded-2xl p-8 hover:bg-white/5 transition-colors"
          >
            <span className="text-4xl">{b.icon}</span>
            <div>
              <div className="text-base font-bold mb-2 text-white">{b.t}</div>
              <div className="text-sm text-[#9AA0B4] leading-relaxed">{b.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
