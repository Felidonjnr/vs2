import React, { useState, useEffect } from 'react';
import { generateOrderId } from '../constants';

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

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  address: string;
  qr: string | null;
}

interface PaymentPageProps {
  product: Product;
  qty: number;
  cryptos: Crypto[];
  onBack: () => void;
  onPaid: (orderId: string, email: string, cryptoSymbol: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ product, qty, cryptos, onBack, onPaid }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [orderId] = useState(generateOrderId);
  const [secureConfig, setSecureConfig] = useState<{ address: string; qr: string | null } | null>(null);
  
  const total = product.price * qty;
  const crypto = cryptos.find(c => c.id === selected);

  // Check for secure routing when a crypto is selected
  useEffect(() => {
    if (selected) {
      const checkSecure = async () => {
        try {
          const res = await fetch(`/api/payment-config?cryptoId=${selected}&amount=${total}`);
          const data = await res.json();
          if (data.useSecure) {
            setSecureConfig({ address: data.address, qr: data.qr });
          } else {
            setSecureConfig(null);
          }
        } catch (e) {
          setSecureConfig(null);
        }
      };
      checkSecure();
    } else {
      setSecureConfig(null);
    }
  }, [selected, total]);

  const copy = () => {
    const addressToCopy = secureConfig?.address || crypto?.address;
    if (addressToCopy) { 
      navigator.clipboard.writeText(addressToCopy).catch(() => {}); 
      setCopied(true); 
      setTimeout(() => setCopied(false), 2000); 
    }
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const canPay = selected && isValidEmail(email);

  return (
    <div className="max-w-[700px] mx-auto px-5 pb-20 pt-10">
      <button className="btn-outline px-4 py-2 rounded-lg text-[13px] mb-7" onClick={onBack}>← Back</button>
      
      <div className="card fade-up p-6 mb-5">
        <div className="text-xs text-[#C9A84C] font-bold tracking-[0.1em] mb-4">CUSTOMER INFORMATION</div>
        <div className="text-xs text-[#6A7090] mb-2">Email Address (For delivery)</div>
        <input 
          type="email" 
          placeholder="your@email.com" 
          className="admin-input py-3 px-4 text-sm" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        {!isValidEmail(email) && email.length > 0 && (
          <div className="text-[10px] text-[#FF4444] mt-1.5 ml-1">Please enter a valid email address</div>
        )}
      </div>

      <div className="card fade-up p-6 mb-5">
        <div className="text-xs text-[#C9A84C] font-bold tracking-[0.1em] mb-4">ORDER SUMMARY</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-xl">{product.icon}</div>
            <div>
              <div className="font-bold text-[15px] text-[#E8EAF0]">{product.name}</div>
              <div className="text-xs text-[#6A7090]">Qty: {qty} unit{qty > 1 ? "s" : ""}</div>
            </div>
          </div>
          <div className="text-2xl font-black text-[#C9A84C]">${total}</div>
        </div>
      </div>
      <div className="card fade-up p-6 mb-5">
        <div className="text-xs text-[#C9A84C] font-bold tracking-[0.1em] mb-4">SELECT PAYMENT METHOD</div>
        <div className="grid grid-cols-2 gap-3">
          {cryptos.map(c => (
            <div key={c.id} className={`crypto-card ${selected === c.id ? "selected" : ""}`} onClick={() => setSelected(c.id)}>
              <div className="flex items-center gap-2.5">
                <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-lg font-extrabold" style={{ background: `${c.color}20`, border: `1px solid ${c.color}40`, color: c.color }}>{c.icon}</div>
                <div>
                  <div className="font-bold text-sm text-[#E8EAF0]">{c.symbol}</div>
                  <div className="text-[11px] text-[#6A7090]">{c.name}</div>
                </div>
                {selected === c.id && <div className="ml-auto w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center text-[11px] text-[#080A0F] font-extrabold">✓</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      {crypto && (
        <div className="card fade-up p-6 mb-5">
          <div className="text-xs text-[#C9A84C] font-bold tracking-[0.1em] mb-5">SEND PAYMENT TO</div>
          <div className="flex gap-6 items-start flex-col sm:flex-row">
            <div className="flex-1 w-full">
              <div className="text-xs text-[#6A7090] mb-1.5">Amount</div>
              <div className="text-[26px] font-black text-[#E8EAF0] mb-5">${total} <span className="text-[15px] text-[#C9A84C]">in {crypto.symbol}</span></div>
              <div className="text-xs text-[#6A7090] mb-2">{crypto.name} Wallet Address</div>
              <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-3 px-3.5 mb-3">
                <div className="text-[11px] text-[#C9A84C] font-mono break-all leading-[1.6]">{secureConfig?.address || crypto.address}</div>
              </div>
              <button className={`btn-gold w-full p-[11px] rounded-[10px] text-[13px] ${copied ? "copied" : ""}`} onClick={copy}>{copied ? "✓ COPIED!" : "📋 COPY ADDRESS"}</button>
            </div>
            <div className="text-center w-full sm:w-auto flex flex-col items-center">
              <div className="text-xs text-[#6A7090] mb-2.5">Scan QR Code</div>
              {(secureConfig?.qr || crypto.qr) ? (
                <div className="bg-white p-2 rounded-xl inline-block">
                  <img src={secureConfig?.qr || crypto.qr || ""} alt="QR Code" className="w-[150px] h-[150px] block object-contain" />
                </div>
              ) : (
                <div className="w-[166px] h-[166px] bg-[rgba(255,255,255,0.04)] border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl flex flex-col items-center justify-center gap-2">
                  <span className="text-[28px]">🔲</span>
                  <span className="text-[11px] text-[#5A607A] text-center leading-[1.5]">QR code not uploaded yet</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 bg-[rgba(255,183,0,0.06)] border border-[rgba(255,183,0,0.2)] rounded-[10px] p-3 px-4">
            <div className="text-xs text-[#FFB300] font-bold">⚠ IMPORTANT</div>
            <div className="text-xs text-[#9AA0B4] mt-1 leading-[1.6]">Send the exact amount in {crypto.symbol}. After sending, click below to get your order ID and contact our Telegram support for delivery.</div>
          </div>
        </div>
      )}
      <button 
        className="btn-gold w-full p-4 rounded-xl text-[15px]" 
        style={{ opacity: canPay ? 1 : 0.5, pointerEvents: canPay ? "auto" : "none" }} 
        onClick={() => onPaid(orderId, email, crypto?.symbol || "")}
      >
        ✅ I HAVE SENT PAYMENT →
      </button>
      {!canPay && (
        <p className="text-center text-xs text-[#5A607A] mt-2.5">
          {!selected ? "Select a payment method" : "Enter a valid email address"} to continue
        </p>
      )}
    </div>
  );
};
