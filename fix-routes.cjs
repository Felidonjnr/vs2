const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// The regex replacement failed because we changed PaymentPage.tsx to use "cart" instead of "product", 
// but App.tsx still has the old PaymentPageRoute which calls PaymentPage with {product, qty}.
// This causes PaymentPage to crash because `cart` is undefined!

const paymentRegex = /function PaymentPageRoute.*?return.*?<\/PaymentPage>\s*\);\s*}/s;
content = content.replace(paymentRegex, `function PaymentPageRoute({ cart, cryptos, navigate, setCart }: { cart: CartItem[], cryptos: Crypto[], navigate: any, setCart: any }) {
  if (!cart || cart.length === 0) {
    navigate("/");
    return null;
  }
  
  const handlePaid = async (orderId: string, email: string, cryptoSymbol: string) => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    const combinedName = cart.map(item => \`\${item.qty}x \${item.product.name}\`).join(', ');
    
    const order = {
      id: orderId,
      productId: cart[0].product.id,
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
      if (dbError) console.error("Database insert error:", dbError);
      
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
      cryptos={cryptos || []}
      onBack={() => navigate("/cart")}
      onPaid={handlePaid}
    />
  );
}`);

const confirmRegex = /function ConfirmPageRoute.*?return.*?<\/ConfirmPage>\s*\);\s*}/s;
content = content.replace(confirmRegex, `function ConfirmPageRoute({ cart, setCart, settings, navigate }: { cart: CartItem[], setCart: any, settings: { telegramLink: string }, navigate: any }) {
  const { orderId } = useParams();
  
  if (!cart || cart.length === 0 || !orderId) {
    return <div className="p-20 text-center">Order not found or cart empty</div>;
  }
  
  return (
    <ConfirmPage 
      orderId={orderId}
      cart={cart}
      settings={settings}
      onHome={() => {
        setCart([]); // Clear cart after successful order!
        navigate("/");
      }}
    />
  );
}`);

fs.writeFileSync('src/App.tsx', content);
