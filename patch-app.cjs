const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add isLoadingData state
content = content.replace(
  'const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);',
  'const [products, setProducts] = useState<Product[]>([]);\n  const [isLoadingData, setIsLoadingData] = useState(true);'
);
content = content.replace(
  'const [cryptos, setCryptos] = useState<Crypto[]>(INITIAL_CRYPTOS);',
  'const [cryptos, setCryptos] = useState<Crypto[]>([]);'
);

// 2. Update fetching logic to track loading
content = content.replace(
  'fetchProducts();\n    fetchCryptos();\n    fetchReviews();',
  `const fetchAll = async () => {
      setIsLoadingData(true);
      await Promise.all([fetchProducts(), fetchCryptos(), fetchReviews()]);
      setIsLoadingData(false);
    };
    fetchAll();`
);

// 3. Update HomePage route
content = content.replace(
  '<HomePage \n              user={user}\n              products={products} \n              reviews={reviews}\n              settings={settings}\n              onProduct={p => navigate(`/product/${p.id}`)} \n            />',
  '<HomePage \n              user={user}\n              products={products} \n              reviews={reviews}\n              settings={settings}\n              isLoading={isLoadingData}\n              onProduct={p => navigate(`/product/${p.id}`)} \n            />'
);

// 4. Update ProductPageRoute invocation
content = content.replace(
  '<Route path="/product/:id" element={<ProductPageRoute products={products} navigate={navigate} cart={cart} setCart={setCart} />} />',
  '<Route path="/product/:id" element={<ProductPageRoute products={products} navigate={navigate} cart={cart} setCart={setCart} isLoading={isLoadingData} />} />'
);

// 5. Update ProductPageRoute definition
const productPageRouteDef = `function ProductPageRoute({ products, navigate, cart, setCart }: { products: Product[], navigate: any, cart: CartItem[], setCart: any }) {`;
const newProductPageRouteDef = `function ProductPageRoute({ products, navigate, cart, setCart, isLoading }: { products: Product[], navigate: any, cart: CartItem[], setCart: any, isLoading?: boolean }) {`;
content = content.replace(productPageRouteDef, newProductPageRouteDef);

// 6. Update ProductPageRoute logic for loading
content = content.replace(
  'const product = products.find(p => p.id === Number(id));\n  \n  if (!product) return <div className="p-20 text-center">Product not found</div>;',
  `const product = products.find(p => p.id === Number(id));
  
  if (isLoading) return <ProductPageSkeleton onBack={() => navigate("/")} />;
  if (!product) return <div className="p-20 text-center">Product not found</div>;`
);

// 7. Add ProductPageSkeleton import
content = content.replace(
  'import { ProductPage } from "./components/ProductPage";',
  'import { ProductPage, ProductPageSkeleton } from "./components/ProductPage";'
);

fs.writeFileSync('src/App.tsx', content);
