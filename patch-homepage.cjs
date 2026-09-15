const fs = require('fs');

let content = fs.readFileSync('src/components/HomePage.tsx', 'utf8');

// 1. Add isLoading to HomePageProps
content = content.replace(
  'onProduct: (product: Product) => void;\n}',
  'onProduct: (product: Product) => void;\n  isLoading?: boolean;\n}'
);

// 2. Add isLoading to HomePage destructuring
content = content.replace(
  'export const HomePage: React.FC<HomePageProps> = ({ user, products, reviews, settings, onProduct }) => {',
  'export const HomePage: React.FC<HomePageProps> = ({ user, products, reviews, settings, isLoading, onProduct }) => {'
);

// 3. Create HomeSkeleton component before HomePage
const homeSkeleton = `
const ProductCardSkeleton = () => (
  <div className="product-card">
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse" />
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse mb-2" />
      <div className="h-3 w-full bg-white/5 rounded animate-pulse mb-1" />
      <div className="h-3 w-5/6 bg-white/5 rounded animate-pulse mb-6" />
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-white/5 animate-pulse" />
        <div className="h-2 w-20 bg-white/5 rounded animate-pulse" />
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <div className="flex flex-col gap-1">
          <div className="h-2 w-10 bg-white/5 rounded animate-pulse" />
          <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);
`;

content = content.replace(
  'export const HomePage: React.FC<HomePageProps>',
  homeSkeleton + '\nexport const HomePage: React.FC<HomePageProps>'
);

// 4. Update the Product Grid section
const gridCheckStart = `{filtered.length === 0 ? (
          <div className="text-center text-[#6A7090] py-20 text-sm font-bold tracking-widest uppercase">
            No products available in this category.
          </div>
        ) : (`;

const gridCheckReplacement = `
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[#6A7090] py-20 text-sm font-bold tracking-widest uppercase">
            No products available in this category.
          </div>
        ) : (
`;

content = content.replace(gridCheckStart, gridCheckReplacement);

fs.writeFileSync('src/components/HomePage.tsx', content);
