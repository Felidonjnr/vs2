import React from 'react';

export const Ticker: React.FC = () => {
  return (
    <div className="bg-[rgba(201,168,76,0.05)] border-b border-[rgba(201,168,76,0.1)] py-[7px] overflow-hidden">
      <div className="inline-flex gap-[60px] animate-[ticker_30s_linear_infinite] whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-[60px]">
            {["⚡ Instant Support", "₿ Crypto Payments Only", "🎮 Gaming Cards", "🎬 Streaming Vouchers", "✅ Trusted Store", "🔒 Secure Orders"].map((t, j) => (
              <span key={j} className="text-[11px] text-[#C9A84C] font-bold tracking-[0.08em]">{t}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
