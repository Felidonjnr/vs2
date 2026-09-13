import React, { useState } from 'react';
import { TELEGRAM_LINK } from '../constants';

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

interface ConfirmPageProps {
  orderId: string;
  product: Product;
  qty: number;
  settings: { telegramLink: string };
  onHome: () => void;
}

export const ConfirmPage: React.FC<ConfirmPageProps> = ({ orderId, product, qty, settings, onHome }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { 
    navigator.clipboard.writeText(orderId).catch(() => {}); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const telegramLink = settings.telegramLink || TELEGRAM_LINK;
  
  return (
    <div className="max-w-[580px] mx-auto px-5 pb-20 pt-[60px] text-center">
      <div className="fade-up text-[64px] mb-4">✅</div>
      <h1 className="fade-up text-[28px] font-black mb-2.5 text-[#E8EAF0]">Payment Sent!</h1>
      <p className="fade-up text-[15px] text-[#9AA0B4] leading-[1.7] mb-8">Use your unique order ID below to contact our Telegram support team and receive your product instantly.</p>
      <div className="card fade-up p-8 mb-5">
        <div className="text-xs text-[#6A7090] font-bold tracking-[0.1em] mb-3">YOUR ORDER ID</div>
        <div className="text-[42px] font-black text-[#C9A84C] tracking-[0.05em] mb-4 font-mono">{orderId}</div>
        <button className={`btn-gold px-6 py-2.5 rounded-[9px] text-[13px] ${copied ? "copied" : ""}`} onClick={copy}>{copied ? "✓ COPIED!" : "📋 Copy Order ID"}</button>
      </div>
      <div className="card fade-up p-6 mb-5 text-left">
        <div className="text-xs text-[#C9A84C] font-bold tracking-[0.1em] mb-4">ORDER DETAILS</div>
        {[["Product", product.name], ["Quantity", qty], ["Total", `$${product.price * qty}`], ["Order ID", orderId], ["Status", "⏳ Awaiting Confirmation"]].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
            <span className="text-[13px] text-[#6A7090]">{k}</span>
            <span className={`text-[13px] font-bold ${k === "Status" ? "text-[#FFB300]" : "text-[#E8EAF0]"}`}>{v}</span>
          </div>
        ))}
      </div>
      <div className="fade-up bg-[rgba(0,230,118,0.05)] border border-[rgba(0,230,118,0.15)] rounded-[14px] p-6 mb-5">
        <div className="text-[15px] font-bold mb-2 text-[#E8EAF0]">📱 Next Step</div>
        <p className="text-[13px] text-[#9AA0B4] leading-[1.7] mb-4">Send your Order ID <strong className="text-[#C9A84C]">{orderId}</strong> to our Telegram support. We will verify your payment and deliver your product right away.</p>
        <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="no-underline">
          <button className="btn-gold w-full p-[15px] rounded-[11px] text-[15px]">CONTACT SUPPORT ON TELEGRAM →</button>
        </a>
      </div>
      <button className="btn-outline px-6 py-2.5 rounded-[9px] text-[13px]" onClick={onHome}>← Back to Store</button>
    </div>
  );
};
