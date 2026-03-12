'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getOrdersByUserId, Order } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, MapPin, CreditCard, Loader2, ChevronDown, ChevronUp, RefreshCw, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

// Format phone number with +91 prefix
// Format: +91 XXXXX XXXXX
const formatPhoneWithCountryCode = (phone: string): string => {
  if (!phone) return '';
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // If phone is 10 digits, format as +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  // If already has +91 prefix, return as is
  if (phone.startsWith('+91')) return phone;
  // Otherwise return with +91 prefix
  return `+91 ${phone}`;
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Fetch orders function
  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (!user?.uid) {
      console.log('No user UID available');
      return;
    }
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      console.log('Fetching orders for user:', user.uid);
      const fetchedOrders = await getOrdersByUserId(user.uid);
      console.log('Fetched orders:', fetchedOrders.length, fetchedOrders);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch orders when user is available
  useEffect(() => {
    if (user?.uid) {
      fetchOrders();
    }
  }, [user?.uid, fetchOrders]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleRefresh = () => {
    fetchOrders(true);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  // Show loading while fetching orders
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
          <Button 
            onClick={() => router.push('/#products')}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                        </span>
                        {order.paymentMethod && (
                          <span className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            {order.paymentMethod}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={`${statusColors[order.status]} text-white`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image || '/placeholder-product.png'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="text-xl font-bold text-cyan-600">{formatPrice(order.total || 0)}</span>
                    </div>
                  </div>
                  
                  {/* Delivery Details - Expandable */}
                  {order.deliveryAddress && (
                    <div className="border-t">
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Delivery Details
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-4 text-sm">
                          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Phone:</span>
                              <span className="font-medium">{formatPhoneWithCountryCode(order.deliveryAddress.phone)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Address:</span>
                              <span className="font-medium text-right">{order.deliveryAddress.address}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">City:</span>
                              <span className="font-medium">{order.deliveryAddress.city}</span>
                            </div>
                            {order.deliveryAddress.notes && (
                              <div className="pt-2 border-t">
                                <span className="text-gray-500 block mb-1">Delivery Notes:</span>
                                <span className="font-medium">{order.deliveryAddress.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
