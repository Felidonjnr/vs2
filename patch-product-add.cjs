const fs = require('fs');
let content = fs.readFileSync('src/components/ProductPage.tsx', 'utf8');

// Update imports
content = content.replace(
  "import { motion } from 'motion/react';",
  "import { motion, AnimatePresence } from 'motion/react';"
);

// Add isAdded state
content = content.replace(
  '  const [qty, setQty] = useState(1);',
  '  const [qty, setQty] = useState(1);\n  const [isAdded, setIsAdded] = useState(false);'
);

// Add handleAddToCart function
const handleAddReplace = `  const handleAddToCart = () => {
    onAddToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const stockColor = (s: number) =>`;

content = content.replace('  const stockColor = (s: number) =>', handleAddReplace);

// Update button
const oldButton = `        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="btn-gold w-full py-5 rounded-xl text-[13px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-[0_15px_35px_rgba(212,175,55,0.15)]" 
          onClick={() => onAddToCart(product, qty)}
        >
          <span>🔐</span> ADD TO CART
        </motion.button>`;

const newButton = `        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={\`w-full py-5 rounded-xl text-[13px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 \${
            isAdded 
              ? "bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30 shadow-[0_15px_35px_rgba(0,230,118,0.15)]" 
              : "btn-gold shadow-[0_15px_35px_rgba(212,175,55,0.15)]"
          }\`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <span>✨</span> ADDED TO CART
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <span>🔐</span> ADD TO CART
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/components/ProductPage.tsx', content);
