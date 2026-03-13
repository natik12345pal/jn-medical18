'use client';

import { Product } from '@/lib/firestore';
import { ProductCard } from '@/components/products/ProductCard';
import { Package, Search } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  searchQuery?: string;
}

export function ProductGrid({ products, searchQuery }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          {searchQuery ? (
            <Search className="h-12 w-12 text-gray-400" />
          ) : (
            <Package className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {searchQuery ? 'No products found' : 'No products available'}
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          {searchQuery 
            ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
            : 'Check back later for new products'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
