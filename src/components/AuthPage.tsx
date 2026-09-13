import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const saveUserRecord = async (user: User, isNew: boolean) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const now = Date.now();
      
      if (isNew) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          lastLogin: now,
          lastActive: now,
          createdAt: now
        });
      } else {
        await setDoc(userRef, {
          lastLogin: now,
          lastActive: now
        }, { merge: true });
      }
    } catch (err) {
      console.error("Error saving user record:", err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserRecord(res.user, true);
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        await saveUserRecord(res.user, false);
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Sign-in method disabled. Please enable 'Email/Password' in your Firebase Console (Authentication > Sign-in method).");
      } else {
        setError(err.message.replace("Firebase: ", ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", res.user.uid);
      const userDoc = await getDoc(userRef);
      await saveUserRecord(res.user, !userDoc.exists());
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Google sign-in disabled. Please enable 'Google' in your Firebase Console (Authentication > Sign-in method).");
      } else {
        setError(err.message.replace("Firebase: ", ""));
      }
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError(null);
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-20 relative overflow-hidden bg-[#05060A]">
      {/* Animated background elements */}
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
            ⚡
          </motion.div>
          <h1 className="text-3xl font-serif font-black text-white mb-3 tracking-tight">
            {isSignUp ? "Join the Elite" : "Welcome Back"}
          </h1>
          <p className="text-sm text-[#6A7090] font-light">Access the world's most exclusive digital assets</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-[#6A7090] font-black tracking-[0.2em] uppercase ml-1">Identity (Email)</label>
            <input 
              type="email" 
              className="admin-input py-4 px-5 text-sm bg-white/2 border-white/5 focus:border-[#D4AF37]/30 transition-all rounded-2xl" 
              placeholder="name@exclusive.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] text-[#6A7090] font-black tracking-[0.2em] uppercase">Access Key (Password)</label>
              {!isSignUp && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="text-[10px] text-[#D4AF37] font-black tracking-widest hover:text-white transition-colors"
                >
                  RECOVER
                </button>
              )}
            </div>
            <input 
              type="password" 
              className="admin-input py-4 px-5 text-sm bg-white/2 border-white/5 focus:border-[#D4AF37]/30 transition-all rounded-2xl" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
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

            {resetSent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] p-4 rounded-xl text-center"
              >
                Recovery link dispatched to your inbox.
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="btn-gold w-full py-5 rounded-2xl text-[12px] font-black tracking-[0.2em] uppercase shadow-[0_20px_40px_rgba(212,175,55,0.15)]"
          >
            {loading ? "AUTHENTICATING..." : isSignUp ? "ESTABLISH ACCOUNT" : "SECURE ACCESS"}
          </motion.button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em]"><span className="bg-[#10131C] px-6 text-[#5A607A] font-black">Alternative Protocol</span></div>
        </div>

        <motion.button 
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          onClick={handleGoogle}
          className="w-full bg-white/2 border border-white/5 py-4 rounded-2xl text-[11px] font-black tracking-widest flex items-center justify-center gap-4 transition-all text-white uppercase"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-70" alt="Google" />
          Google Authentication
        </motion.button>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] text-[#6A7090] tracking-wider uppercase font-medium"
          >
            {isSignUp ? "Existing member? " : "New to the platform? "}
            <span className="text-[#D4AF37] font-black hover:text-white transition-colors">{isSignUp ? "Sign In" : "Register"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
