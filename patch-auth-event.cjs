const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldAuthEvent = `    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setHasRedirected(false);
      setAuthLoading(false);
    });`;

const newAuthEvent = `    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setHasRedirected(false);
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovering(true);
      }
      
      setAuthLoading(false);
    });
    
    // Also check URL hash for recovery token manually on mount to be extra safe
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
      setIsRecovering(true);
    }`;

content = content.replace(oldAuthEvent, newAuthEvent);
fs.writeFileSync('src/App.tsx', content);
