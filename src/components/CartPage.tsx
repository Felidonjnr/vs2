import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQty: (cartItemId: string, qty: number) => void;
  onRemove: (cartItemId: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateQty, onRemove, onCheckout, onBack }) => {
  const total = cart.reduce((sum, item) => sum + (item.variant?.price || item.product.price) * item.qty, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[800px] mx-auto px-5 pb-20 pt-10"
    >
      <button 
        className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#6A7090] hover:text-[#D4AF37] transition-colors mb-8" 
        onClick={onBack}
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> 
        Continue Shopping
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Your Shopping Cart</h1>
        <div className="text-[11px] text-[#C9A84C] tracking-widest font-bold uppercase bg-[#C9A84C]/10 px-4 py-2 rounded-full border border-[#C9A84C]/20">
          {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="card p-12 text-center border border-white/5 flex flex-col items-center justify-center">
          <div className="text-6xl mb-6 opacity-50">🔐</div>
          <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-[#9AA0B4] mb-8 font-medium">You haven't added any products yet. Browse our store to begin.</p>
          <button 
            onClick={onBack}
            className="btn-gold px-8 py-3 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => {
                const cartItemId = `${item.product.id}-${item.variant?.id || ''}`;
                const itemPrice = item.variant?.price || item.product.price;
                
                return (
                  <motion.div 
                    key={cartItemId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="card p-4 sm:p-6 border border-white/5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative group"
                  >
                    <button 
                      onClick={() => onRemove(cartItemId)}
                      className="absolute top-4 right-4 text-[#6A7090] hover:text-red-400 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 sm:opacity-100"
                      title="Remove item"
                    >
                      ×
                    </button>

                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-3xl">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        item.product.icon
                      )}
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="text-[10px] text-[#C9A84C] font-black uppercase tracking-widest mb-1">{item.product.category}</div>
                      <div className="font-bold text-white mb-1 pr-8 sm:pr-0 line-clamp-1">
                        {item.product.name}
                        {item.variant && <span className="text-[#9AA0B4] ml-2 text-xs border border-white/10 px-2 py-0.5 rounded-full bg-white/5">{item.variant.name}</span>}
                      </div>
                      <div className="text-sm font-bold text-[#E8EAF0]">${itemPrice.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                      <div className="flex items-center bg-white/5 rounded-lg overflow-hidden border border-white/10 h-10 w-[110px]">
                        <button 
                          onClick={() => onUpdateQty(cartItemId, Math.max(1, item.qty - 1))} 
                          className="flex-1 h-full hover:bg-white/5 text-[#C9A84C] text-lg transition-colors font-medium"
                        >−</button>
                        <span className="w-10 text-center text-sm font-bold text-white">{item.qty}</span>
                        <button 
                          onClick={() => onUpdateQty(cartItemId, Math.min(item.product.stock, item.qty + 1))} 
                          className="flex-1 h-full hover:bg-white/5 text-[#C9A84C] text-lg transition-colors font-medium"
                        >+</button>
                      </div>
                      <div className="text-right sm:hidden">
                        <div className="text-[10px] text-[#6A7090] uppercase tracking-[0.2em] font-black mb-0.5">Price</div>
                        <div className="text-sm font-bold text-white">${(itemPrice * item.qty).toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 border border-white/5 sticky top-[100px]">
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-[#9AA0B4]">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-white">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[#9AA0B4]">
                  <span>Transaction Fee</span>
                  <span className="text-[#C9A84C] font-bold">Free</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6A7090]">Total Amount</span>
                  <span className="text-3xl font-black text-[#C9A84C]">${total.toLocaleString()}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCheckout}
                className="btn-gold w-full py-4 rounded-xl text-[12px] font-black tracking-[0.15em] uppercase shadow-[0_15px_35px_rgba(212,175,55,0.15)]"
              >
                PROCEED TO CHECKOUT →
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
