import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Review } from '../types';
import { TELEGRAM_LINK } from '../constants';

interface HomePageProps {
  user: any;
  products: Product[];
  reviews: Review[];
  settings: { telegramLink: string };
  onProduct: (product: Product) => void;
  isLoading?: boolean;
}


const ProductCardSkeleton = () => (
  <div className="product-card">
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse" />
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse mb-2" />
      <div className="h-3 w-full bg-white/5 rounded animate-pulse mb-1" />
      <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse mb-6" />
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-white/5 animate-pulse" />
        <div className="h-2 w-20 bg-white/5 rounded animate-pulse" />
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex flex-col gap-1">
          <div className="h-2 w-10 bg-white/5 rounded animate-pulse" />
          <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

export const HomePage: React.FC<HomePageProps> = ({ user, products, reviews, settings, isLoading, onProduct }) => {
  const [activeCat, setActiveCat] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ["All", ...Array.from(cats)];
  }, [products]);

  const filtered = activeCat === "All" ? products : products.filter(p => p.category === activeCat);
  const stockColor = (s: number) => s <= 3 ? "#FF4444" : s <= 7 ? "#FFB347" : "#00E676";
  const telegramLink = settings.telegramLink || TELEGRAM_LINK;

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-32 pb-16 px-5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-[#9AA0B4] uppercase">Secure Store Active</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black tracking-tighter mb-6 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 fade-up">
            Premium Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Products.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#9AA0B4] mb-12 max-w-[650px] mx-auto leading-relaxed fade-up" style={{ animationDelay: '0.1s' }}>
            Your trusted store for premium software keys, digital subscriptions, and exclusive products. Every key is verified and delivered instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up" style={{ animationDelay: '0.2s' }}>
            <button className="btn-gold px-8 py-4 w-full sm:w-auto text-[13px]" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth'})}>
              BROWSE PRODUCTS →
            </button>
            <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <button className="btn-outline px-8 py-4 w-full sm:w-auto text-[13px] border-white/20">
                TELEGRAM SUPPORT
              </button>
            </a>
          </div>
          
          {/* Trust Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto mt-24 text-left fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/2 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors">
              <div className="text-3xl mb-4 opacity-80">🛡️</div>
              <h3 className="text-[#C9A84C] font-black text-[11px] tracking-[0.2em] uppercase mb-2">100% Hand-Verified</h3>
              <p className="text-[#6A7090] text-xs leading-relaxed font-medium">Unlike open marketplaces, every asset in our vault is tested and verified prior to listing. Zero invalid keys.</p>
            </div>
            <div className="bg-white/2 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors">
              <div className="text-3xl mb-4 opacity-80">⚡</div>
              <h3 className="text-[#C9A84C] font-black text-[11px] tracking-[0.2em] uppercase mb-2">Instant Delivery</h3>
              <p className="text-[#6A7090] text-xs leading-relaxed font-medium">The moment the blockchain confirms your payment, your product is delivered directly to your email.</p>
            </div>
            <div className="bg-white/2 border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-colors">
              <div className="text-3xl mb-4 opacity-80">💎</div>
              <h3 className="text-[#C9A84C] font-black text-[11px] tracking-[0.2em] uppercase mb-2">Premium Selection</h3>
              <p className="text-[#6A7090] text-xs leading-relaxed font-medium">We provide premium, verified keys and products you can trust, unlike open marketplaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 mb-10 max-w-[1400px] mx-auto sticky top-[72px] z-40 bg-[#080A0F]/90 backdrop-blur-md py-4 border-b border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`cat-btn whitespace-nowrap ${activeCat === cat ? "active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat === "All" ? "ALL PRODUCTS" : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Sections */}
      <section className="px-5 max-w-[1400px] mx-auto min-h-[500px] space-y-16">
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={`skel-${i}`} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[#6A7090] py-20 text-sm font-bold tracking-widest uppercase">
            No products available in this category.
          </div>
        ) : (
          <div className="space-y-16">
            {activeCat === "All" ? (
              categories.filter(c => c !== "All").map(cat => {
                const sectionProducts = products.filter(p => p.category === cat);
                if (sectionProducts.length === 0) return null;
                return (
                  <div key={cat} className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                      <h2 className="text-2xl font-black text-white tracking-widest uppercase">{cat}</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                    </div>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      <AnimatePresence mode="popLayout">
                        {sectionProducts.map(p => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            key={p.id} 
                            className="product-card group" 
                            onClick={() => onProduct(p)}
                          >
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-6">
                      {p.image ? (
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_8px_20px_rgba(212,175,55,0.15)]">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-[0_8px_20px_rgba(212,175,55,0.15)]">{p.icon}</div>
                      )}
                      
                      {p.tag && (
                        <div className={`tag ${p.tag === "HOT" ? "bg-gradient-to-br from-[#FF4D00] to-[#FF8A00] text-white" : p.tag === "SALE" ? "bg-[#D4AF37] text-[#05060A]" : "bg-red-600 text-white"}`}>
                          {p.tag === "LOW" ? "⚠ LOW" : p.tag}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-[10px] text-[#C9A84C] tracking-widest font-black uppercase">{p.category}</div>
                      {p.rating && (
                        <div className="flex items-center gap-1 text-[10px] text-[#C9A84C] font-bold bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">
                          <span>★</span> {p.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#C9A84C] transition-colors">{p.name}</h3>
                    <p className="text-xs text-[#9AA0B4] leading-relaxed mb-6 line-clamp-2 font-medium">{p.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stockColor(p.stock) }} />
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: stockColor(p.stock) }}>
                        {p.stock <= 3 ? `Critical: ${p.stock} remain` : `${p.stock} in reserve`}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#5A607A] uppercase font-black tracking-[0.2em] mb-1">Value</span>
                        <span className="text-xl font-bold text-white">${p.price}</span>
                      </div>
                      <button className="btn-gold px-5 py-2.5 rounded-lg text-[10px] tracking-widest">VIEW</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
                  </div>
                );
              })
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map(p => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      key={p.id} 
                      className="product-card group" 
                      onClick={() => onProduct(p)}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          {p.image ? (
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-500 shadow-[0_8px_20px_rgba(212,175,55,0.15)]">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-[0_8px_20px_rgba(212,175,55,0.15)]">{p.icon}</div>
                          )}
                          
                          {p.tag && (
                            <div className={`tag ${p.tag === "HOT" ? "bg-gradient-to-br from-[#FF4D00] to-[#FF8A00] text-white" : p.tag === "SALE" ? "bg-[#D4AF37] text-[#05060A]" : "bg-red-600 text-white"}`}>
                              {p.tag === "LOW" ? "⚠ LOW" : p.tag}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-[10px] text-[#C9A84C] tracking-widest font-black uppercase">{p.category}</div>
                          {p.rating && (
                            <div className="flex items-center gap-1 text-[10px] text-[#C9A84C] font-bold bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">
                              <span>★</span> {p.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#C9A84C] transition-colors">{p.name}</h3>
                        <p className="text-xs text-[#9AA0B4] leading-relaxed mb-6 line-clamp-2 font-medium">{p.description}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stockColor(p.stock) }} />
                          <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: stockColor(p.stock) }}>
                            {p.stock <= 3 ? `Critical: ${p.stock} remain` : `${p.stock} in reserve`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-[#5A607A] uppercase font-black tracking-[0.2em] mb-1">Value</span>
                            <span className="text-xl font-bold text-white">${p.price}</span>
                          </div>
                          <button className="btn-gold px-5 py-2.5 rounded-lg text-[10px] tracking-widest">VIEW</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}
      </section>

      {/* Trusted Reviews Section */}
      {reviews.length > 0 && (
        <section className="mt-32 max-w-[1400px] mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-black text-white mb-4">Customer Reviews</h2>
            <p className="text-sm text-[#6A7090] font-medium tracking-wide">Feedback from our verified buyers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(r => (
              <div key={r.id} className="bg-white/2 border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-colors">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-[#D4AF37] text-6xl font-serif leading-none rotate-12 group-hover:rotate-0 transition-transform">"</div>
                <div className="flex items-center gap-1 mb-4 text-[#D4AF37] text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={`star-${r.id}-${i}`} className={i < r.rating ? "opacity-100" : "opacity-30"}>★</span>
                  ))}
                </div>
                <p className="text-sm text-[#E8EAF0] leading-relaxed mb-6 relative z-10 font-medium">"{r.text}"</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                      {r.avatar ? <img src={r.avatar} alt={r.name} className="w-full h-full rounded-full object-cover" /> : r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{r.name}</div>
                      <div className="text-[10px] text-[#6A7090] uppercase tracking-wider">{new Date(r.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-[#00E676] tracking-widest uppercase bg-[#00E676]/10 px-2 py-1 rounded border border-[#00E676]/20">Verified</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
