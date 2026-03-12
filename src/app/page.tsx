'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getProducts, Product } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Truck, Shield, Clock, Headphones } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[url('/logo.jpg')] bg-center bg-no-repeat opacity-5" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Truck className="h-4 w-4" />
              FREE DELIVERY NATIONWIDE
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Quality Medical Supplies
              <span className="block text-cyan-400">You Can Trust</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              JN Medical Suppliers provides healthcare professionals with premium 
              medical equipment and supplies. Fast delivery, competitive prices, 
              and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#products">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 px-8">
                  Browse Products
                </Button>
              </Link>
              {/* Only show Create Account button when user is NOT logged in */}
              {!user && (
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8"
                  >
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                <p className="text-sm text-gray-500">On all orders nationwide</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quality Assured</h3>
                <p className="text-sm text-gray-500">Certified medical products</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Shipping</h3>
                <p className="text-sm text-gray-500">Quick order processing</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Headphones className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-500">Expert assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our extensive catalog of medical supplies and equipment. 
              All products are sourced from trusted manufacturers.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>

      {/* CTA Section - Bulk Orders */}
      <section className="py-16 bg-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Bulk Orders?</h2>
          <p className="text-cyan-100 max-w-2xl mx-auto">
            We offer special pricing for hospitals, clinics, and healthcare facilities. 
            Contact us for wholesale inquiries at{' '}
            <a href="tel:+918840989780" className="font-semibold text-white hover:underline">+91 8840989780</a>{' '}
            or email us at{' '}
            <a href="mailto:jnmedicalsuppliers@gmail.com" className="font-semibold text-white hover:underline">jnmedicalsuppliers@gmail.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
