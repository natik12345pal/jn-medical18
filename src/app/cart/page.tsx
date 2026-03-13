'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some products to get started</p>
        <Link href="/#products">
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700">
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder-product.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-cyan-600 mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-12 h-8 text-center border-0 p-0"
                          min="1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                onClick={handleCheckout}
              >
                {user ? (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Sign in to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
