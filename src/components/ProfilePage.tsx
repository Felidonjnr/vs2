import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../supabase";
import { Order } from "../types";

export function ProfilePage({ user, onBack, onSignOut }: { user: any; onBack: () => void; onSignOut: () => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.email) return;
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("email", user.email)
          .order("timestamp", { ascending: false });
          
        if (error) {
          console.error("Error fetching orders:", error);
        } else if (data) {
          setOrders(data as Order[]);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#080A0F] text-[#E8EAF0] pt-24 pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-[800px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6"
        >
          <div>
            <button 
              onClick={onBack}
              className="text-[#6A7090] hover:text-[#C9A84C] text-sm font-semibold tracking-widest uppercase transition-colors mb-6 flex items-center gap-2"
            >
              ← Back to Shop
            </button>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">My Vault</h1>
            <p className="text-[#9AA0B4] text-sm">Account & Order History</p>
          </div>

          <div className="flex items-center gap-4 bg-[#11131A] p-4 rounded-2xl border border-white/5 shadow-xl w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-[#1A1D27] flex items-center justify-center border border-white/10 text-[#C9A84C] font-bold text-xl">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-white font-medium">{user.email}</div>
              <div className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase mt-1">Verified Member</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#11131A] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative"
        >
          {/* Subtle top glare */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg text-white font-serif font-bold tracking-wide">Order History</h2>
            <div className="text-[11px] text-[#6A7090] font-bold tracking-widest uppercase">{orders.length} Orders</div>
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#C9A84C] animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center text-2xl">📦</div>
                <div className="text-[#9AA0B4] text-sm max-w-xs mx-auto">Your vault is currently empty. Orders you place will appear securely here.</div>
                <button 
                  onClick={onBack}
                  className="mt-8 px-8 py-3 rounded-xl bg-white/5 text-[#C9A84C] text-[11px] font-black tracking-widest uppercase border border-white/10 hover:border-[#C9A84C]/50 hover:bg-white/10 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#161922] border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:border-[#C9A84C]/30 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] text-[#C9A84C] font-black tracking-widest uppercase px-2 py-1 bg-[#C9A84C]/10 rounded-md">
                          {order.id}
                        </span>
                        <span className="text-xs text-[#6A7090]">
                          {new Date(order.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-white">{order.productName}</div>
                      <div className="text-xs text-[#9AA0B4] mt-1">Qty: {order.qty} &bull; Total: ${order.total.toLocaleString()} ({order.cryptoSymbol})</div>
                    </div>
                    
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        order.status === 'completed' 
                          ? 'text-[#00E676] bg-[#00E676]/10 border-[#00E676]/30' 
                          : 'text-[#E6B800] bg-[#E6B800]/10 border-[#E6B800]/30'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Mobile Sign Out Button */}
        <div className="mt-8 text-center sm:hidden">
          <button 
            onClick={onSignOut}
            className="text-[10px] font-black tracking-widest uppercase text-[#FF4444] py-3 px-6 rounded-full border border-[#FF4444]/20 bg-[#FF4444]/5"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
