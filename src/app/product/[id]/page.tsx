'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, Product } from '@/lib/firestore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, ArrowLeft, Check, Truck, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(params.id as string);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 w-24 mb-8 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 w-3/4 rounded" />
              <div className="h-6 bg-gray-200 w-1/4 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
        <p className="text-gray-500 mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.image || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-cyan-600">${product.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center gap-4">
            {product.stock > 0 ? (
              <>
                <Badge variant="default" className="bg-green-500">
                  In Stock
                </Badge>
                <span className="text-sm text-gray-500">
                  {product.stock <= 10 ? `Only ${product.stock} left` : `${product.stock} available`}
                </span>
              </>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
              <Truck className="h-6 w-6 text-cyan-600 mb-2" />
              <span className="text-xs font-medium">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
              <Shield className="h-6 w-6 text-cyan-600 mb-2" />
              <span className="text-xs font-medium">Quality Assured</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
              <Check className="h-6 w-6 text-cyan-600 mb-2" />
              <span className="text-xs font-medium">Certified</span>
            </div>
          </div>

          {/* Quantity & Actions */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
