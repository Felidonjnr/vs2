import React from 'react';
import { supabase } from '../supabase';

interface NavProps {
  onHome: () => void;
  onAdmin: () => void;
  onCart: () => void;
  onProfile: () => void;
  cartItemCount: number;
  user: any;
  secureMode?: boolean;
}

export const Nav: React.FC<NavProps> = ({ onHome, onAdmin, onCart, onProfile, cartItemCount, user, secureMode }) => {
  return (
    <nav className="sticky top-0 z-100 bg-[#05060A]/80 backdrop-blur-[24px] border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer group" onClick={onHome}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-lg sm:text-xl shadow-[0_8px_20px_rgba(212,175,55,0.2)] group-hover:scale-110 transition-transform duration-500">⚡</div>
          <div>
            <div className="text-lg sm:text-xl font-serif font-bold tracking-tight leading-none text-white">VaultShop</div>
            <div className="text-[7px] sm:text-[8px] text-[#D4AF37] tracking-[0.25em] font-black uppercase mt-1">Premium Digital Assets</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {user && (
          <button 
            onClick={onCart}
            className="relative flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white hover:text-[#D4AF37] transition-colors bg-white/5 px-4 py-2.5 rounded-full border border-white/10 hover:border-[#D4AF37]/30"
          >
            🛒 Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-[#05060A] w-5 h-5 flex items-center justify-center rounded-full text-xs font-black shadow-[0_0_10px_rgba(201,168,76,0.5)]">
                {cartItemCount}
              </span>
            )}
          </button>
          )}

          {user && (
            <>
              <button 
                onClick={onProfile}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10 text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                title="My Account"
              >
                <span className="text-sm font-bold text-[#D4AF37]">{user.email.charAt(0).toUpperCase()}</span>
              </button>
              
              {user.email === "godshandudoh@gmail.com" && (
                <button 
                  onClick={onAdmin}
                  className={`hidden sm:flex text-[9px] sm:text-[10px] font-black transition-all border px-3 sm:px-5 py-2 sm:py-2.5 rounded-full tracking-widest uppercase items-center gap-2 ${
                    secureMode 
                      ? "text-[#00E676] border-[#00E676]/40 bg-[#00E676]/5 shadow-[0_0_15px_rgba(0,230,118,0.1)]" 
                      : "text-[#D4AF37] border-[#D4AF37]/40 hover:text-white hover:border-white/20"
                  }`}
                >
                  {secureMode && <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />}
                  {secureMode ? "Admin" : "Admin"}
                </button>
              )}
              <button 
                onClick={() => supabase.auth.signOut()}
                className="hidden sm:block text-[9px] sm:text-[10px] font-black text-[#6A7090] hover:text-[#D4AF37] transition-all border border-white/10 hover:border-[#D4AF37]/40 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full tracking-widest uppercase whitespace-nowrap"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
