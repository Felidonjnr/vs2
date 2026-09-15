import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';

export const UpdatePasswordPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-20 relative overflow-hidden bg-[#05060A]">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card w-full max-w-[440px] p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-4xl mx-auto mb-6 shadow-[0_15px_35px_rgba(212,175,55,0.25)]"
          >
            🔐
          </motion.div>
          <h1 className="text-3xl font-serif font-black text-white mb-3 tracking-tight">
            Update Password
          </h1>
          <p className="text-sm text-[#6A7090] font-light">Secure your account with a new access key.</p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_15px_35px_rgba(0,230,118,0.15)]">
              ✨
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Password Updated</h2>
            <p className="text-sm text-[#9AA0B4] leading-relaxed font-medium mb-8">
              Your new password has been successfully saved. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-[#6A7090] font-black tracking-[0.2em] uppercase ml-1">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="admin-input py-4 pl-5 pr-12 text-sm bg-white/2 border-white/5 focus:border-[#D4AF37]/30 transition-all rounded-2xl w-full" 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7090] hover:text-[#D4AF37] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-[#6A7090] font-black tracking-[0.2em] uppercase ml-1">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="admin-input py-4 pl-5 pr-12 text-sm bg-white/2 border-white/5 focus:border-[#D4AF37]/30 transition-all rounded-2xl w-full" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7090] hover:text-[#D4AF37] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-4 rounded-xl text-center leading-relaxed"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="btn-gold w-full py-5 rounded-2xl text-[12px] font-black tracking-[0.2em] uppercase shadow-[0_20px_40px_rgba(212,175,55,0.15)] mt-4"
            >
              {loading ? "SAVING..." : "UPDATE PASSWORD"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
