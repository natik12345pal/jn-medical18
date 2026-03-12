'use client';

import { Product } from '@/lib/firestore';
import { ProductCard } from '@/components/products/ProductCard';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Package className="h-16 w-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-sm">Check back later for new products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
