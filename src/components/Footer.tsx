import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] py-10 px-6 bg-[#060810]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A84C] to-[#A07830] flex items-center justify-center text-sm">⚡</div>
          <span className="text-lg font-bold text-white">VaultCards</span>
        </div>
        <div className="flex gap-8 flex-wrap justify-center">
          {["Terms", "Privacy", "FAQ", "Support"].map(l => <span key={l} className="text-sm text-[#6A7090] hover:text-[#C9A84C] transition-colors cursor-pointer">{l}</span>)}
        </div>
        <span className="text-xs text-[#5A607A]">© 2026 VaultCards. All rights reserved.</span>
      </div>
    </footer>
  );
};
