import React from 'react';
import { supabase } from '../supabase';

interface NavProps {
  onHome: () => void;
  onAdmin: () => void;
  user: any;
  secureMode?: boolean;
}

export const Nav: React.FC<NavProps> = ({ onHome, onAdmin, user, secureMode }) => {
  return (
    <nav className="sticky top-0 z-100 bg-[#05060A]/80 backdrop-blur-[24px] border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer group" onClick={onHome}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-lg sm:text-xl shadow-[0_8px_20px_rgba(212,175,55,0.2)] group-hover:scale-110 transition-transform duration-500">⚡</div>
          <div>
            <div className="text-lg sm:text-xl font-serif font-bold tracking-tight leading-none text-white">VaultShop</div>
            <div className="text-[7px] sm:text-[8px] text-[#D4AF37] tracking-[0.25em] font-black uppercase mt-1">Digital Marketplace</div>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 sm:gap-6">
            {user.email === "godshandudoh@gmail.com" && (
              <button 
                onClick={onAdmin}
                className={`text-[9px] sm:text-[10px] font-black transition-all border px-3 sm:px-5 py-2 sm:py-2.5 rounded-full tracking-widest uppercase flex items-center gap-2 ${
                  secureMode 
                    ? "text-[#00E676] border-[#00E676]/40 bg-[#00E676]/5 shadow-[0_0_15px_rgba(0,230,118,0.1)]" 
                    : "text-[#D4AF37] border-[#D4AF37]/40 hover:text-white hover:border-white/20"
                }`}
              >
                {secureMode && <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />}
                {secureMode ? "Secure Admin" : "Admin"}
              </button>
            )}
            <div className="hidden lg:block text-right">
              <div className="text-[9px] text-[#6A7090] font-black uppercase tracking-[0.15em] mb-0.5">Account</div>
              <div className="text-xs text-white/90 font-medium">{user.email}</div>
            </div>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="text-[9px] sm:text-[10px] font-black text-[#6A7090] hover:text-[#D4AF37] transition-all border border-white/10 hover:border-[#D4AF37]/40 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full tracking-widest uppercase whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
