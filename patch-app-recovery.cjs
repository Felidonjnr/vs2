const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for UpdatePasswordPage
content = content.replace(
  'import { AuthPage } from "./components/AuthPage";',
  'import { AuthPage } from "./components/AuthPage";\nimport { UpdatePasswordPage } from "./components/UpdatePasswordPage";'
);

// 2. Add isRecovering state
content = content.replace(
  'const [authLoading, setAuthLoading] = useState(true);',
  'const [authLoading, setAuthLoading] = useState(true);\n  const [isRecovering, setIsRecovering] = useState(false);'
);

// 3. Update auth state listener
const oldAuthEffect = `  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setHasRedirected(false);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);`;

const newAuthEffect = `  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setHasRedirected(false);
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovering(true);
      }
      
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);`;

content = content.replace(oldAuthEffect, newAuthEffect);

// 4. Update the render logic for auth
const authRender = `  if (!user) {
    return (
      <div className="min-h-screen bg-[#080A0F] text-[#E8EAF0] font-sans">
        <Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} onCart={() => navigate("/cart")} cartItemCount={0} user={null} />
        <AuthPage />
        {telegramButton}
      </div>
    );
  }`;

const newAuthRender = `  if (isRecovering) {
    return (
      <div className="min-h-screen bg-[#080A0F] text-[#E8EAF0] font-sans">
        <Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} onCart={() => navigate("/cart")} cartItemCount={0} user={null} />
        <UpdatePasswordPage onComplete={() => setIsRecovering(false)} />
        {telegramButton}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080A0F] text-[#E8EAF0] font-sans">
        <Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} onCart={() => navigate("/cart")} cartItemCount={0} user={null} />
        <AuthPage />
        {telegramButton}
      </div>
    );
  }`;

content = content.replace(authRender, newAuthRender);

fs.writeFileSync('src/App.tsx', content);
