import React, { useState } from 'react';
import { motion } from 'motion/react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  description: string;
  tag: string | null;
}

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onOrder: (product: Product, qty: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack, onOrder }) => {
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
        Back to Collection
      </button>

      <div className="card p-8 relative overflow-hidden">
        <div className="flex gap-8 items-start mb-10 flex-wrap md:flex-nowrap">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-4xl"
          >
            {product.icon}
          </motion.div>
          
          <div className="flex-1">
            <div className="text-[11px] text-[#C9A84C] tracking-widest font-bold uppercase mb-2">{product.category}</div>
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
          <h3 className="text-[11px] font-bold text-[#6A7090] mb-3 tracking-widest uppercase">Product Details</h3>
          <p className="text-base text-[#9AA0B4] leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: stockColor(product.stock) }} />
              <span className="text-sm font-bold tracking-tight" style={{ color: stockColor(product.stock) }}>
                {product.stock <= 3 ? `Critical: Only ${product.stock} units left` : `${product.stock} units available in vault`}
              </span>
            </div>
            <span className="text-xs text-[#6A7090] font-medium uppercase tracking-wider">Availability</span>
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
            <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase">Unit Price</div>
            <div className="text-3xl font-bold text-[#C9A84C]">${product.price.toLocaleString()}</div>
          </div>

          <div className="space-y-3">
            <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase text-center sm:text-left">Select Quantity</div>
            <div className="flex items-center bg-white/5 rounded-lg overflow-hidden border border-white/10 h-12 max-w-[200px] mx-auto sm:mx-0">
              <button 
                onClick={() => setQty(q => Math.max(1, q - 1))} 
                className="flex-1 h-full hover:bg-white/5 text-[#C9A84C] text-xl transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center text-lg font-bold text-white">{qty}</span>
              <button 
                onClick={() => setQty(q => Math.min(product.stock, q + 1))} 
                className="flex-1 h-full hover:bg-white/5 text-[#C9A84C] text-xl transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2 text-center md:text-left sm:col-span-2 md:col-span-1">
            <div className="text-[10px] text-[#6A7090] font-bold tracking-widest uppercase">Total Price</div>
            <div className="text-3xl font-bold text-white">${(product.price * qty).toLocaleString()}</div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-gold w-full py-4 rounded-xl text-[13px] font-bold tracking-widest uppercase" 
          onClick={() => onOrder(product, qty)}
        >
          Secure Transaction →
        </motion.button>
      </div>
    </motion.div>
  );
};
