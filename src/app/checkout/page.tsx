'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import { createOrder, OrderItem, DeliveryAddress } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShoppingBag, MapPin, CreditCard, CheckCircle, ChevronRight, ChevronLeft, Banknote, Truck, User } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

type CheckoutStep = 'delivery' | 'payment' | 'review';

// Indian phone number validation
const validateIndianPhone = (phone: string): { isValid: boolean; error: string } => {
  // Remove any spaces or dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Check if it's exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return { isValid: false, error: 'Please enter a valid 10-digit mobile number' };
  }
  
  // Check if it starts with 6, 7, 8, or 9 (valid Indian mobile prefixes)
  if (!/^[6-9]/.test(cleaned)) {
    return { isValid: false, error: 'Indian mobile numbers must start with 6, 7, 8, or 9' };
  }
  
  return { isValid: true, error: '' };
};

// Format phone for display (with +91 prefix and readable spacing)
// Format: +91 XXXXX XXXXX
const formatPhoneForDisplay = (phone: string): string => {
  if (!phone) return '';
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    // Format as +91 XXXXX XXXXX
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return `+91 ${phone}`;
};

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  
  const [formData, setFormData] = useState<DeliveryAddress>({
    phone: '',
    address: '',
    city: '',
    notes: ''
  });
  const [phoneError, setPhoneError] = useState<string>('');

  const [paymentMethod] = useState<'Cash on Delivery'>('Cash on Delivery');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 w-48 mb-8 rounded" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    router.push('/cart');
    return null;
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-2">Thank you for your order.</p>
        <p className="text-sm text-gray-400 mb-8">Order ID: {orderId}</p>
        <div className="space-y-3">
          <Link href="/orders">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
              View My Orders
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle phone input - only allow digits and max 10 characters
  const handlePhoneChange = (value: string) => {
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 10 digits
    const limited = digitsOnly.slice(0, 10);
    
    setFormData({ ...formData, phone: limited });
    
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleContinueToPayment = () => {
    // Validate phone number first
    const phoneValidation = validateIndianPhone(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error);
      toast.error(phoneValidation.error);
      return;
    }
    
    // Validate other fields
    if (!formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setPhoneError('');
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToReview = () => {
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDelivery = () => {
    setCurrentStep('delivery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPayment = () => {
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      const order = await createOrder({
        userId: user.uid,
        userName: userData?.name || 'Unknown',
        userEmail: user.email || 'Unknown',
        items: orderItems,
        total: getTotal(),
        status: 'pending',
        paymentMethod: paymentMethod,
        deliveryAddress: formData
      });

      setOrderId(order.id);
      clearCart();
      setSuccess(true);
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'delivery', label: 'Delivery', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: ShoppingBag }
  ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['delivery', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${status === 'completed' ? 'bg-green-500 border-green-500 text-white' : ''}
                  ${status === 'current' ? 'bg-cyan-600 border-cyan-600 text-white' : ''}
                  ${status === 'upcoming' ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                `}>
                  {status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block
                  ${status === 'current' ? 'text-cyan-600' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4
                    ${getStepStatus(steps[index + 1].id) === 'upcoming' ? 'bg-gray-300' : 'bg-green-500'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Delivery Form */}
          {currentStep === 'delivery' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={userData?.name || ''}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-700 font-medium">
                        <span>+91</span>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`rounded-l-none ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        maxLength={10}
                        required
                      />
                    </div>
                    {phoneError && (
                      <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Medical Drive"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Healthcare City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions for delivery..."
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Continue Button */}
              <div className="flex justify-end">
                <Button 
                  type="button"
                  onClick={handleContinueToPayment}
                  className="bg-cyan-600 hover:bg-cyan-700 px-8"
                >
                  Continue to Payment
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to pay for your order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Cash on Delivery Option - Pre-selected */}
                    <div className="relative flex items-start p-4 border-2 border-cyan-500 rounded-lg bg-cyan-50">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked
                          readOnly
                          className="w-4 h-4 text-cyan-600 border-cyan-600 focus:ring-cyan-500"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
                          <span className="ml-auto text-xs bg-cyan-600 text-white px-2 py-1 rounded">
                            Selected
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay with cash when your order is delivered. No advance payment required.
                        </p>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <Truck className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Free Delivery</p>
                        <p className="text-sm text-amber-700">Your order will be delivered to your address. Payment is collected upon delivery.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleBackToDelivery}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Delivery
                </Button>
                <Button 
                  type="button"
                  onClick={handleContinueToReview}
                  className="bg-cyan-600 hover:bg-cyan-700 px-8"
                >
                  Review Order
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review Order */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Delivery Details Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 font-medium">{userData?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 font-medium">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="ml-2 font-medium">{formatPhoneForDisplay(formData.phone)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">City:</span>
                      <span className="ml-2 font-medium">{formData.city}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Address:</span>
                    <span className="ml-2 font-medium">{formData.address}</span>
                  </div>
                  {formData.notes && (
                    <div className="text-sm">
                      <span className="text-gray-500">Notes:</span>
                      <span className="ml-2 font-medium">{formData.notes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Banknote className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay with cash when your order is delivered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5" />
                    Order Items ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <div className="relative h-14 w-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image || '/placeholder-product.png'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleBackToPayment}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Payment
                </Button>
                <Button 
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary - Always visible on the right */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-12 w-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image || '/placeholder-product.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <p className="text-xs text-gray-500 text-center">
                By placing your order, you agree to our terms and conditions.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
