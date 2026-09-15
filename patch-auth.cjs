const fs = require('fs');
let content = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

// Update states
content = content.replace(
  'const [password, setPassword] = useState("");',
  'const [password, setPassword] = useState("");\n  const [confirmPassword, setConfirmPassword] = useState("");\n  const [isSuccess, setIsSuccess] = useState(false);'
);

// Update handleAuth
const handleAuthStart = 'const handleAuth = async (e: React.FormEvent) => {';
const handleAuthNew = `const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);`;
content = content.replace(handleAuthStart, handleAuthNew);

// Update success handling
content = content.replace(
  'if (data?.user && !data?.session) {\n          setMessage("Registration successful! Please check your email to verify your account. If you don\'t require verification, disable it in Supabase.");\n        }',
  'if (data?.user && !data?.session) {\n          setIsSuccess(true);\n        }'
);

// Add clear form when switching modes
content = content.replace(
  'onClick={() => setIsSignUp(!isSignUp)}',
  'onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); setPassword(""); setConfirmPassword(""); setIsSuccess(false); }}'
);

// Add success screen rendering inside the motion.div
const formStart = '<form onSubmit={handleAuth} className="space-y-6">';
const successBlock = `
        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_15px_35px_rgba(0,230,118,0.15)]">
              ✨
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
            <p className="text-sm text-[#9AA0B4] leading-relaxed font-medium mb-8">
              We've sent a verification link to <span className="text-[#C9A84C] font-bold">{email}</span>. Please click the link to activate your premium account.
            </p>
            <button 
              onClick={() => { setIsSuccess(false); setIsSignUp(false); }}
              className="btn-outline w-full py-4 rounded-xl text-[11px] font-black tracking-[0.2em] uppercase border-white/20"
            >
              RETURN TO SIGN IN
            </button>
          </div>
        ) : (
        <form onSubmit={handleAuth} className="space-y-6">
`;
content = content.replace(formStart, successBlock);

// Close the conditional rendering at the end of the form
const formEnd = '</form>';
const formEndReplace = '</form>\n        )}';
content = content.replace(formEnd, formEndReplace);

// Add confirm password field
const passwordField = `
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] text-[#6A7090] font-black tracking-[0.2em] uppercase">Password</label>
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
`;

const newPasswordFields = `
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] text-[#6A7090] font-black tracking-[0.2em] uppercase">Password</label>
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

          <AnimatePresence>
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <div className="pt-2">
                  <label className="text-[10px] text-[#6A7090] font-black tracking-[0.2em] uppercase ml-1">Confirm Password</label>
                  <input 
                    type="password" 
                    className="admin-input py-4 px-5 text-sm bg-white/2 border-white/5 focus:border-[#D4AF37]/30 transition-all rounded-2xl mt-2 w-full" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
`;

content = content.replace(passwordField, newPasswordFields);

// Adjust subtitle
content = content.replace(
  '<p className="text-sm text-[#6A7090] font-light">Sign in to access your digital products</p>',
  '<p className="text-sm text-[#6A7090] font-light">{isSignUp ? "Register to secure your assets" : "Sign in to access your digital products"}</p>'
);

fs.writeFileSync('src/components/AuthPage.tsx', content);
