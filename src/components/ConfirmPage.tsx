import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TELEGRAM_LINK } from '../constants';
import { CartItem } from '../types';

interface ConfirmPageProps {
  orderId: string;
  cart: CartItem[];
  settings: { telegramLink: string };
  onHome: () => void;
}

export const ConfirmPage: React.FC<ConfirmPageProps> = ({ orderId, cart, settings, onHome }) => {
  const [copied, setCopied] = useState(false);
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const copy = () => {
     navigator.clipboard.writeText(orderId).catch(() => {});
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
   };

  const telegramLink = settings.telegramLink || TELEGRAM_LINK;
  
  return (
    <div className="max-w-[600px] mx-auto px-5 pb-20 pt-10 text-center">
      
      {/* Stepper (Step 3) */}
      <div className="flex items-center gap-4 mb-12 max-w-[400px] mx-auto opacity-70">
        <div className="flex-1 h-1.5 rounded-full bg-[#C9A84C]" />
        <div className="flex-1 h-1.5 rounded-full bg-[#C9A84C]" />
        <div className="flex-1 h-1.5 rounded-full bg-[#C9A84C]" />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 mx-auto mb-8 relative"
      >
        <div className="absolute inset-0 border-4 border-[#C9A84C]/20 rounded-full" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-[#C9A84C] border-t-transparent rounded-full" 
        />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          ⏳
        </div>
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-[32px] font-black mb-3 text-white tracking-tight"
      >
        Verifying Payment
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[15px] text-[#9AA0B4] leading-relaxed mb-10 max-w-[450px] mx-auto"
      >
        Your payment is currently being verified on the blockchain. Once confirmed, your digital products will be sent to your email.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card p-8 mb-6 text-left relative overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
          <div className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase">Order Status</div>
          <div className="bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase animate-pulse">
            Verifying...
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <span className="text-xs text-[#6A7090] font-bold uppercase tracking-wider">Order ID</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-white font-bold">{orderId}</span>
              <button onClick={copy} className="text-[#C9A84C] hover:text-white transition-colors">
                {copied ? "✓" : "📋"}
              </button>
            </div>
          </div>
          
          <div className="py-2 space-y-3">
            <span className="text-xs text-[#6A7090] font-bold uppercase tracking-wider block mb-2">Items</span>
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center">
                <span className="text-sm text-white">{item.qty}x {item.product.name}</span>
                <span className="text-sm text-white/50">${item.product.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-xs text-[#6A7090] font-bold uppercase tracking-wider">Total</span>
            <span className="text-lg text-[#C9A84C] font-bold">${total.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/2 border border-white/5 rounded-2xl p-6 mb-8"
      >
        <div className="text-[11px] font-black text-white uppercase tracking-widest mb-2">Need Assistance?</div>
        <p className="text-xs text-[#9AA0B4] leading-relaxed mb-4">
          If your transaction takes longer than 15 minutes to confirm, or you need immediate help, please contact our support team.
        </p>
        <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
          <button className="bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9]/20 border border-[#229ED9]/20 transition-colors w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.36-.49.99-.75 3.88-1.69 6.46-2.8 7.74-3.33 3.69-1.54 4.45-1.81 4.95-1.81.11 0 .35.03.5.16.13.1.17.24.18.34.01.06.02.18.01.22z"/>
            </svg>
            Contact Telegram Support
          </button>
        </a>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs font-bold text-[#6A7090] hover:text-white uppercase tracking-widest transition-colors" 
        onClick={onHome}
      >
        Return to Store
      </motion.button>
    </div>
  );
};
