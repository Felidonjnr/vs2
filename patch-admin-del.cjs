const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPage.tsx', 'utf8');

// Function to delete user
const deleteUserFunc = `
  const handleDeleteUser = async (uid: string, email: string) => {
    if (!window.confirm(\`Are you sure you want to completely delete user \${email}?\`)) return;
    
    try {
      const res = await fetch(\`/api/users/\${uid}\`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!res.ok) {
        alert("Failed to delete user: " + (data.error || "Unknown error"));
        return;
      }
      
      // Update UI
      setUsers(prev => prev.filter(u => u.uid !== uid));
    } catch (err) {
      alert("Error deleting user: " + err);
    }
  };

  // Sync secure settings from Supabase
`;

content = content.replace('// Sync secure settings from Supabase', deleteUserFunc);

// Add the delete button next to the active status
const userCardReplace = `
                        {isActive && (
                          <span className="text-[9px] bg-[#00E676]/10 text-[#00E676] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-[#00E676]/20">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#5A607A] font-mono mt-1 tracking-wider uppercase">{u.uid}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleDeleteUser(u.uid, u.email)}
                      className="text-[9px] bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest font-bold border border-red-500/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="flex gap-10 flex-wrap w-full md:w-auto mt-4 md:mt-0">
`;

// wait, let's use a regex or string match
const userCardFind = `                        {isActive && (
                          <span className="text-[9px] bg-[#00E676]/10 text-[#00E676] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-[#00E676]/20">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#5A607A] font-mono mt-1 tracking-wider uppercase">{u.uid}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-10 flex-wrap">`;

content = content.replace(userCardFind, userCardReplace);

fs.writeFileSync('src/components/AdminPage.tsx', content);
