const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The regex replacement failed again because the original string didn't exactly match the regex,
// likely due to spacing or nested components.
// We will manually replace the exact blocks.

const startPayment = content.indexOf('function PaymentPageRoute');
const endPayment = content.indexOf('function ConfirmPageRoute');
const startConfirm = content.indexOf('function ConfirmPageRoute');
const endConfirm = content.indexOf('export default function App()');

if (startPayment !== -1 && endPayment !== -1 && startConfirm !== -1 && endConfirm !== -1) {
  const newPayment = `function PaymentPageRoute({ cart, cryptos, navigate, setCart }: { cart: CartItem[], cryptos: Crypto[], navigate: any, setCart: any }) {
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
}

`;

  const newConfirm = `function ConfirmPageRoute({ cart, setCart, settings, navigate }: { cart: CartItem[], setCart: any, settings: { telegramLink: string }, navigate: any }) {
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
}

`;

  const beforePayment = content.substring(0, startPayment);
  const afterConfirm = content.substring(endConfirm);
  
  content = beforePayment + newPayment + newConfirm + afterConfirm;
  fs.writeFileSync('src/App.tsx', content);
  console.log("Successfully replaced the functions using exact index boundaries.");
} else {
  console.log("Could not find exact boundaries.");
}
