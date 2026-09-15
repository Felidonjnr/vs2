const fs = require('fs');
let content = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

const oldReset = `const handleReset = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setResetSent(true);
      setError(null);
      setMessage("Recovery link dispatched to your inbox.");
    } catch (err: any) {
      setError(err.message);
    }
  };`;

const newReset = `const handleReset = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setResetSent(true);
      setError(null);
      setMessage("Recovery link dispatched to your inbox. Check your spam folder if you don't see it.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldReset, newReset);
fs.writeFileSync('src/components/AuthPage.tsx', content);
