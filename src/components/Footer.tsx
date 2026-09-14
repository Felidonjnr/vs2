import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-16 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-2xl mx-auto mb-6">⚡</div>
        <div className="text-[#C9A84C] font-serif font-bold text-2xl mb-4 tracking-tight">VaultShop</div>
        <p className="text-[11px] text-[#6A7090] max-w-[550px] mx-auto leading-relaxed uppercase tracking-widest mb-8 font-medium">
          VaultShop provides premium, verified digital products. All payments are secure and final. 24/7 VIP Support available via Telegram.
        </p>
        <div className="flex justify-center gap-6 mb-8">
          <span className="text-[10px] font-black text-[#5A607A] uppercase tracking-[0.2em] hover:text-[#C9A84C] cursor-pointer transition-colors">Terms of Service</span>
          <span className="text-[10px] font-black text-[#5A607A] uppercase tracking-[0.2em] hover:text-[#C9A84C] cursor-pointer transition-colors">Privacy Policy</span>
          <span className="text-[10px] font-black text-[#5A607A] uppercase tracking-[0.2em] hover:text-[#C9A84C] cursor-pointer transition-colors">Contact Us</span>
        </div>
        <div className="text-[10px] text-[#5A607A] font-medium tracking-wider">
          © {new Date().getFullYear()} VaultShop. Premium Products. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
