const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
content = content.replace(
  'import { ConfirmPage } from "./components/ConfirmPage";',
  'import { ConfirmPage } from "./components/ConfirmPage";\nimport { CartPage } from "./components/CartPage";'
);
content = content.replace(
  'import { Product, Crypto, Order, Review } from "./types";',
  'import { Product, Crypto, Order, Review, CartItem } from "./types";'
);

// State inside AppContent
content = content.replace(
  'const [hasRedirected, setHasRedirected] = useState(false);',
  'const [hasRedirected, setHasRedirected] = useState(false);\n  const [cart, setCart] = useState<CartItem[]>([]);'
);

// Nav usage
content = content.replace(
  '<Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} user={null} />',
  '<Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} onCart={() => navigate("/cart")} cartItemCount={0} user={null} />'
);

content = content.replace(
  '<Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} user={user} secureMode={secureMode} />',
  '<Nav onHome={() => navigate("/")} onAdmin={() => navigate("/admin")} onCart={() => navigate("/cart")} cartItemCount={cart.reduce((sum, item) => sum + item.qty, 0)} user={user} secureMode={secureMode} />'
);

// Update ProductPageRoute
content = content.replace(
  'function ProductPageRoute({ products, navigate }: { products: Product[], navigate: any }) {',
  'function ProductPageRoute({ products, navigate, cart, setCart }: { products: Product[], navigate: any, cart: CartItem[], setCart: any }) {'
);
content = content.replace(
  'onOrder={(_p, q) => navigate(`/payment/${product.id}/${q}`)}',
  'onAddToCart={(_p, q) => {\n        setCart((prev: CartItem[]) => {\n          const existing = prev.find(item => item.product.id === product.id);\n          if (existing) {\n            return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + q } : item);\n          }\n          return [...prev, { product, qty: q }];\n        });\n        navigate("/cart");\n      }}'
);

// Add Route for /cart
content = content.replace(
  '<Route path="/product/:id" element={<ProductPageRoute products={products} navigate={navigate} />} />',
  `<Route path="/product/:id" element={<ProductPageRoute products={products} navigate={navigate} cart={cart} setCart={setCart} />} />
          
          <Route path="/cart" element={
            <CartPage 
              cart={cart}
              onUpdateQty={(id, qty) => setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))}
              onRemove={id => setCart(prev => prev.filter(i => i.product.id !== id))}
              onCheckout={() => navigate("/checkout")}
              onBack={() => navigate("/")}
            />
          } />`
);

// Replace /payment and /confirm Routes
content = content.replace(
  '<Route path="/payment/:id/:qty" element={<PaymentPageRoute products={products} cryptos={cryptos} navigate={navigate} />} />',
  '<Route path="/checkout" element={<PaymentPageRoute cart={cart} cryptos={cryptos} navigate={navigate} setCart={setCart} />} />'
);
content = content.replace(
  '<Route path="/confirm/:id/:qty/:orderId" element={<ConfirmPageRoute products={products} settings={settings} navigate={navigate} />} />',
  '<Route path="/confirm/:orderId" element={<ConfirmPageRoute cart={cart} settings={settings} navigate={navigate} />} />'
);

// Replace PaymentPageRoute
const paymentRegex = /function PaymentPageRoute.*?return.*?<\/PaymentPage>\s*\);\s*}/s;
content = content.replace(paymentRegex, `function PaymentPageRoute({ cart, cryptos, navigate, setCart }: { cart: CartItem[], cryptos: Crypto[], navigate: any, setCart: any }) {
  if (cart.length === 0) {
    navigate("/");
    return null;
  }
  
  const handlePaid = async (orderId: string, email: string, cryptoSymbol: string) => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const combinedName = cart.map(item => \`\${item.qty}x \${item.product.name}\`).join(', ');
    
    const order: Order = {
      id: orderId,
      productId: cart[0].product.id, // reference main product ID or 0
      productName: combinedName,
      qty: cart.reduce((sum, item) => sum + item.qty, 0),
      total: total,
      cryptoSymbol,
      email,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    try {
      const { error: dbError } = await supabase.from('orders').insert([order]);
      
      if (dbError) {
        console.error("Database insert error:", dbError);
      }
      
      // Send confirmation email
      fetch("/api/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          orderId,
          productName: combinedName,
          qty: order.qty,
          total: total,
          cryptoSymbol
        })
      }).catch(err => console.error("Email API failed", err));
      
      navigate(\`/confirm/\${orderId}\`);
    } catch (e) {
      console.error("Failed to save order", e);
      navigate(\`/confirm/\${orderId}\`);
    }
  };
  
  return (
    <PaymentPage 
      cart={cart}
      cryptos={cryptos}
      onBack={() => navigate("/cart")}
      onPaid={handlePaid}
    />
  );
}`);

// Replace ConfirmPageRoute
const confirmRegex = /function ConfirmPageRoute.*?return.*?<\/ConfirmPage>\s*\);\s*}/s;
content = content.replace(confirmRegex, `function ConfirmPageRoute({ cart, settings, navigate }: { cart: CartItem[], settings: { telegramLink: string }, navigate: any }) {
  const { orderId } = useParams();
  
  if (cart.length === 0 || !orderId) {
    return <div className="p-20 text-center">Order not found or cart empty</div>;
  }
  
  return (
    <ConfirmPage 
      orderId={orderId}
      cart={cart}
      settings={settings}
      onHome={() => {
        // Option to clear cart here, but let's assume they want to keep it or we clear it.
        navigate("/");
      }}
    />
  );
}`);

fs.writeFileSync('src/App.tsx', content);
