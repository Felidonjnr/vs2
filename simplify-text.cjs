const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content);
}

// 1. Nav.tsx
replaceInFile('src/components/Nav.tsx', {
  '🔐 Vault': '🛒 Cart',
  'Secure Admin': 'Admin'
});

// 2. HomePage.tsx
replaceInFile('src/components/HomePage.tsx', {
  'Access the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Unattainable.</span>': 'Premium Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Products.</span>',
  'Your trusted broker for premium software keys, digital subscriptions, and exclusive assets. Every key is hand-verified and secured by the blockchain.': 'Your trusted store for premium software keys, digital subscriptions, and exclusive products. Every key is verified and delivered instantly.',
  'EXPLORE THE RESERVE': 'BROWSE PRODUCTS',
  'VIP TELEGRAM DESK': 'TELEGRAM SUPPORT',
  'Secure Network Active': 'Secure Store Active',
  'No assets available in this reserve.': 'No products available in this category.',
  'Encrypted Delivery': 'Instant Delivery',
  'The moment the blockchain confirms your transaction, your asset is encrypted and dispatched directly to your inbox.': 'The moment the blockchain confirms your payment, your product is delivered directly to your email.',
  'The Private Reserve': 'Premium Selection',
  'We source premium allocations and exclusive keys you won\'t find on public retail markets or generic storefronts.': 'We provide premium, verified keys and products you can trust, unlike open marketplaces.',
  'Client Testimonials': 'Customer Reviews',
  'Encrypted communications from verified buyers.': 'Feedback from our verified buyers.',
  'ALL ASSETS': 'ALL PRODUCTS',
  'SECURE': 'VIEW'
});

// 3. ProductPage.tsx
replaceInFile('src/components/ProductPage.tsx', {
  'Back to Vault': 'Back to Store',
  'LOW RESERVE': 'LOW STOCK',
  'Asset Details': 'Product Details',
  'keys remain in reserve': 'in stock',
  'verified keys in reserve': 'in stock',
  'Reserve Status': 'Stock Status',
  'Total Valuation': 'Total Price',
  'SECURE ALLOCATION': 'ADD TO CART',
  'Value': 'Price'
});

// 4. CartPage.tsx
replaceInFile('src/components/CartPage.tsx', {
  'Return to Vault': 'Continue Shopping',
  'Your Secured Allocations': 'Your Shopping Cart',
  'Asset\' : \'Assets': 'Item\' : \'Items',
  'Your vault is currently empty': 'Your cart is empty',
  'You haven\'t secured any digital assets yet. Access our premium reserve to begin.': 'You haven\'t added any products yet. Browse our store to begin.',
  'Access Reserve': 'Browse Products',
  'Transfer Summary': 'Order Summary',
  'assets)': 'items)',
  'Broker Fee': 'Transaction Fee',
  'Waived': 'Free',
  'Total Value': 'Total Amount',
  'INITIATE TRANSFER': 'PROCEED TO CHECKOUT',
  'Value': 'Price'
});

// 5. PaymentPage.tsx
replaceInFile('src/components/PaymentPage.tsx', {
  'Transaction Details': 'Order Details',
  'Review your secure allocations and select a cryptographic settlement method.': 'Please review your order and select a payment method.',
  'Secure Delivery Email': 'Delivery Email',
  'Settlement Protocol': 'Payment Method',
  'Cryptographic Settlement': 'Payment Method',
  'PROCEED TO SETTLEMENT': 'PROCEED TO PAYMENT',
  'Settlement Amount': 'Amount to send',
  'Initiate transfer to the secure cryptographic address below.': 'Send the exact amount to the address below.',
  'I HAVE INITIATED TRANSFER': 'I HAVE SENT PAYMENT'
});

// 6. ConfirmPage.tsx
replaceInFile('src/components/ConfirmPage.tsx', {
  'Verifying Transfer': 'Verifying Payment',
  'Your settlement is currently being verified on the blockchain. Once confirmed, your encrypted digital assets will be dispatched to your email.': 'Your payment is currently being verified on the blockchain. Once confirmed, your digital products will be sent to your email.',
  'Transfer Status': 'Order Status',
  'Transaction ID': 'Order ID',
  'Return to Vault': 'Return to Store'
});

// 7. AuthPage.tsx
replaceInFile('src/components/AuthPage.tsx', {
  'Join the Elite': 'Create Account',
  'Access the world\'s most exclusive digital assets': 'Sign in to access your digital products',
  'Identity (Email)': 'Email Address',
  'Access Key (Password)': 'Password',
  'ESTABLISH ACCOUNT': 'CREATE ACCOUNT',
  'SECURE ACCESS': 'SIGN IN',
  'Alternative Protocol': 'Or Continue With'
});

// 8. Footer.tsx
replaceInFile('src/components/Footer.tsx', {
  'VaultShop operates as a premium digital asset broker. All cryptographic transactions are final and secured by standard blockchain protocols.': 'VaultShop provides premium, verified digital products. All payments are secure and final.',
  'Privacy Protocol': 'Privacy Policy',
  'Audit Logs': 'Contact Us',
  'Private Reserve': 'Premium Products'
});

console.log('Text simplified successfully.');
