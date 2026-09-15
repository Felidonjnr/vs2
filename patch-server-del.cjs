const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const routeToAdd = `
  // API Route: Delete User
  app.delete("/api/users/:uid", async (req, res) => {
    const { uid } = req.params;
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "Server missing SUPABASE_SERVICE_ROLE_KEY required to delete auth users." });
    }

    try {
      // 1. Delete the user from public.users
      await supabase.from('users').delete().eq('uid', uid);
      
      // 2. Delete the user from auth.users using the admin API
      const { error } = await supabase.auth.admin.deleteUser(uid);
      if (error) {
         console.error("Auth Admin Delete Error:", error);
         return res.status(500).json({ error: error.message });
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error("Delete user error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
`;

content = content.replace('// Vite middleware for development', routeToAdd);

fs.writeFileSync('server.ts', content);
