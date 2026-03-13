'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getProducts, Product } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { Truck, Shield, Clock, Headphones, Phone, Mail, Sparkles, ShoppingBag, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { searchQuery } = useSearch();

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

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  return (
    <div className="flex flex-col">
      {/* Hero Banner - Compact */}
      <section className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-6 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                Quality Medical Supplies
              </h1>
              <p className="text-cyan-100 text-sm sm:text-base">
                Trusted by healthcare professionals across India
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Truck className="h-4 w-4" />
                <span>Free Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b py-3 sm:py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Free Delivery</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">All India</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Quality Assured</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">Certified Products</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">Fast Shipping</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">Quick Processing</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Headphones className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">24/7 Support</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">Expert Help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Products */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results` : 'All Products'}
              </h2>
              {!loading && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} 
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              )}
            </div>
            {user && (
              <Link href="/orders" className="hidden sm:block">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  My Orders
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 sm:p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-9 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} searchQuery={searchQuery} />
          )}
        </div>
      </main>

      {/* Contact CTA Section */}
      <section className="bg-white border-t py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-10 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  <span className="text-cyan-400 font-medium text-sm">BULK ORDERS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Need Bulk Orders?
                </h2>
                <p className="text-gray-300 max-w-lg text-sm sm:text-base">
                  Special pricing available for hospitals, clinics, and healthcare facilities. 
                  Contact us for wholesale inquiries.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a 
                  href="tel:+918840989780" 
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 hover:bg-white/20 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">+91 8840989780</span>
                </a>
                <a 
                  href="mailto:jnmedicalsuppliers@gmail.com" 
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 rounded-full px-5 py-2.5 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
