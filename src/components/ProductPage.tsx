import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  const stockColor = (s: number) => s <= 3 ? "#FF4444" : s <= 7 ? "#FFB347" : "#00E676";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[800px] mx-auto px-5 pb-20 pt-10"
    >
      <button 
        className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#6A7090] hover:text-[#D4AF37] transition-colors mb-10" 
        onClick={onBack}
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
        Back to Store
      </button>

      <div className="card p-8 relative overflow-hidden">
        <div className="flex gap-8 items-start mb-10 flex-wrap md:flex-nowrap">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 shrink-0"
          >
            {product.image ? (
              <div className="w-full h-full rounded-2xl overflow-hidden border border-[#C9A84C]/20 shadow-[0_15px_35px_rgba(212,175,55,0.15)]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-4xl shadow-[0_15px_35px_rgba(212,175,55,0.15)]">
                {product.icon}
              </div>
            )}
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="text-[11px] text-[#C9A84C] tracking-widest font-black uppercase">{product.category}</div>
              {product.rating && (
                <div className="flex items-center gap-1 text-[11px] text-[#C9A84C] font-bold">
                  <span>★</span> {product.rating.toFixed(1)}
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-white">{product.name}</h1>
            
            {product.tag && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                product.tag === "HOT" ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                product.tag === "SALE" ? "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20" : 
                "bg-orange-500/10 text-orange-500 border border-orange-500/20"
              }`}>
                {product.tag === "LOW" ? "⚠ LOW STOCK" : product.tag}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/2 border border-white/5 rounded-xl p-6 mb-10">
          <h3 className="text-[11px] font-black text-[#6A7090] mb-3 tracking-widest uppercase">Product Details</h3>
          <p className="text-sm text-[#9AA0B4] leading-relaxed font-medium">{product.description}</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: stockColor(product.stock) }} />
              <span className="text-sm font-bold tracking-tight" style={{ color: stockColor(product.stock) }}>
                {product.stock <= 3 ? `Critical: Only ${product.stock} keys remain` : `${product.stock} in stock`}
              </span>
            </div>
            <span className="text-xs text-[#6A7090] font-black uppercase tracking-widest">Stock Status</span>
          </div>
          
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full" 
              style={{ background: stockColor(product.stock) }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 items-end">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-[10px] text-[#6A7090] font-black tracking-widest uppercase">Price</div>
            <div className="text-3xl font-bold text-[#C9A84C]">${product.price.toLocaleString()}</div>
          </div>
          <div className="space-y-3">
            <div className="text-[10px] text-[#6A7090] font-black tracking-widest uppercase text-center sm:text-left">Select Quantity</div>
            <div className="flex items-center bg-white/5 rounded-lg overflow-hidden border border-white/10 h-12 max-w-[200px] mx-auto sm:mx-0">
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))} 
                className="flex-1 h-full hover:bg-white/5 text-[#C9A84C] text-xl transition-colors font-medium"
              >
                −
              </button>
              <span className="w-12 text-center text-lg font-bold text-white">{qty}</span>
              <button 
                onClick={() => setQty(q => Math.min(product.stock, q + 1))} 
                className="flex-1 h-full hover:bg-white/5 text-[#C9A84C] text-xl transition-colors font-medium"
              >
                +
              </button>
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left sm:col-span-2 md:col-span-1">
            <div className="text-[10px] text-[#6A7090] font-black tracking-widest uppercase">Total Price</div>
            <div className="text-3xl font-bold text-white">${(product.price * qty).toLocaleString()}</div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-gold w-full py-5 rounded-xl text-[13px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-[0_15px_35px_rgba(212,175,55,0.15)]" 
          onClick={() => onAddToCart(product, qty)}
        >
          <span>🔐</span> ADD TO CART
        </motion.button>
      </div>
    </motion.div>
  );
};
