'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    
    toast.success('Added to cart', {
      description: product.name,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                Out of Stock
              </span>
            </div>
          )}
          {/* Low Stock Badge */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 left-2">
              <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                Only {product.stock} left
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-cyan-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="mt-auto pt-2">
            <span className="text-lg sm:text-xl font-bold text-cyan-600">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full mt-3 h-9 sm:h-10 text-sm font-medium transition-all ${
              product.stock <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white hover:shadow-md'
            }`}
          >
            {product.stock <= 0 ? (
              <>
                <Package className="h-4 w-4 mr-1.5" />
                Out of Stock
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
