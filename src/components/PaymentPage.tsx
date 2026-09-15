import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateOrderId } from '../constants';
import { CartItem, Crypto } from '../types';

interface PaymentPageProps {
  cart: CartItem[];
  cryptos: Crypto[];
  onBack: () => void;
  onPaid: (orderId: string, email: string, cryptoSymbol: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ cart, cryptos, onBack, onPaid }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [orderId] = useState(generateOrderId);
  const [secureConfig, setSecureConfig] = useState<{ address: string; qr: string | null } | null>(null);
  
  // Timer state (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const total = cart.reduce((sum, item) => sum + ((item.variant?.price || item.product.price) * item.qty), 0);
  const crypto = cryptos.find(c => c.id === selected);

  // Timer countdown
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
  const canProceedToPayment = selected && isValidEmail(email);

  return (
    <div className="max-w-[700px] mx-auto px-5 pb-20 pt-10">
      <button 
        className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#6A7090] hover:text-[#D4AF37] transition-colors mb-10" 
        onClick={() => {
          if (step === 2) setStep(1);
          else onBack();
        }}
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
        {step === 2 ? "Back to Details" : "Back to Cart"}
      </button>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-10 max-w-[400px] mx-auto">
        <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-[#C9A84C]' : 'bg-white/10'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[#C9A84C]' : 'bg-white/10'}`} />
        <div className="flex-1 h-1.5 rounded-full bg-white/10" />
      </div>
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">Order Details</h1>
              <p className="text-[#9AA0B4]">Please review your order and select a payment method.</p>
            </div>

            <div className="card p-6 border border-white/5">
              <div className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase mb-4">Summary ({cart.length} items)</div>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-white/5">
                {cart.map(item => {
                  const cartItemId = `${item.product.id}-${item.variant?.id || ''}`;
                  const itemPrice = item.variant?.price || item.product.price;
                  return (
                    <div key={cartItemId} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {item.product.image ? (
                          <img src={item.product.image} className="w-10 h-10 rounded-lg object-cover border border-white/10" alt={item.product.name} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-xl">{item.product.icon}</div>
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">
                            {item.product.name}
                            {item.variant && <span className="text-[#9AA0B4] ml-2 font-normal text-xs border border-white/10 px-1.5 py-0.5 rounded bg-white/5">{item.variant.name}</span>}
                          </div>
                          <div className="text-[11px] text-[#6A7090]">Qty: {item.qty} × ${itemPrice}</div>
                        </div>
                      </div>
                      <div className="font-bold text-white">${itemPrice * item.qty}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="text-sm font-bold text-[#9AA0B4]">Total Due</div>
                <div className="text-2xl font-black text-[#C9A84C]">${total.toLocaleString()}</div>
              </div>

              <div className="space-y-2 mb-2">
                <div className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase ml-1">Delivery Email</div>
                <input 
                  type="email" 
                  placeholder="Enter your email to receive the assets..." 
                  className="admin-input py-4 px-5 text-sm w-full bg-white/2 border-white/5 focus:border-[#C9A84C]/30 transition-all rounded-xl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {!isValidEmail(email) && email.length > 0 && (
                  <div className="text-[10px] text-[#FF4444] mt-1 ml-1 font-medium">Please enter a valid email address.</div>
                )}
              </div>
            </div>

            <div className="card p-6 border border-white/5">
              <div className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase mb-4">Payment Method</div>
              <div className="grid grid-cols-2 gap-4">
                {cryptos.map(c => (
                  <div 
                    key={c.id} 
                    className={`crypto-card p-4 rounded-xl cursor-pointer transition-all border ${selected === c.id ? 'border-[#C9A84C] bg-[#C9A84C]/5 shadow-[0_0_20px_rgba(201,168,76,0.1)]' : 'border-white/5 bg-white/2 hover:border-white/20'}`}
                    onClick={() => setSelected(c.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg font-black" style={{ background: `${c.color}15`, color: c.color }}>
                        {c.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm">{c.symbol}</div>
                        <div className="text-[11px] text-[#6A7090]">{c.name}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === c.id ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-white/10'}`}>
                        {selected === c.id && <span className="text-[#05060A] text-xs font-black">✓</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.button 
              whileHover={canProceedToPayment ? { scale: 1.01 } : {}}
              whileTap={canProceedToPayment ? { scale: 0.99 } : {}}
              className="btn-gold w-full py-5 rounded-xl text-[13px] font-black tracking-[0.2em] uppercase shadow-[0_15px_35px_rgba(212,175,55,0.15)]"
              style={{ opacity: canProceedToPayment ? 1 : 0.5, cursor: canProceedToPayment ? "pointer" : "not-allowed" }}
              onClick={() => canProceedToPayment && setStep(2)}
            >
              PROCEED TO PAYMENT →
            </motion.button>
          </motion.div>
        )}

        {step === 2 && crypto && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">Payment Method</h1>
              <p className="text-[#9AA0B4]">Send the exact amount to the address below.</p>
            </div>

            <div className="card p-8 border border-white/5 relative overflow-hidden">
              {/* Order ID & Timer */}
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <div>
                  <div className="text-[10px] text-[#6A7090] font-black tracking-widest uppercase mb-1">Order ID</div>
                  <div className="font-mono text-[#C9A84C] font-bold">{orderId}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#6A7090] font-black tracking-widest uppercase mb-1">Time Remaining</div>
                  <div className={`font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                <div className="w-[180px] h-[180px] shrink-0 bg-white p-3 rounded-2xl flex items-center justify-center">
                  {(secureConfig?.qr || crypto.qr) ? (
                    <img src={secureConfig?.qr || crypto.qr || ""} alt="QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-[#f8f9fa] rounded-xl border-2 border-dashed border-[#e9ecef] flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">🔲</span>
                      <span className="text-[10px] text-[#adb5bd] text-center font-medium px-4">No QR Configured</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full text-center md:text-left space-y-6">
                  <div>
                    <div className="text-[10px] text-[#6A7090] font-black tracking-widest uppercase mb-1">Amount to send</div>
                    <div className="text-4xl font-black text-white">
                      ${total.toLocaleString()} <span className="text-lg text-[#C9A84C] font-bold">in {crypto.symbol}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#6A7090] font-black tracking-widest uppercase mb-2">Destination Address ({crypto.name})</div>
                    <div className="bg-[#0A0C14] border border-white/5 rounded-xl p-4 mb-3 flex items-center justify-between gap-4">
                      <div className="text-xs text-[#C9A84C] font-mono break-all font-medium text-left">
                        {secureConfig?.address || crypto.address}
                      </div>
                    </div>
                    <button 
                      onClick={copy}
                      className={`w-full py-3 rounded-lg text-[11px] font-black tracking-widest uppercase transition-all ${
                        copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {copied ? "✓ Address Copied!" : "📋 Copy Address"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-4 items-start">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Important Notice</div>
                  <div className="text-[11px] text-red-300/80 leading-relaxed">
                    Please send the exact amount requested above. Any other amount may cause your order to fail or be delayed. Once the transaction is sent from your wallet, click the confirmation button below.
                  </div>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-gold w-full py-5 rounded-xl text-[13px] font-black tracking-[0.2em] uppercase shadow-[0_15px_35px_rgba(212,175,55,0.15)]"
              onClick={() => onPaid(orderId, email, crypto.symbol)}
            >
              ✅ I HAVE SENT PAYMENT
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
