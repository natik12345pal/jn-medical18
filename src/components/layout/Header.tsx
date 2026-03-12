'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, Menu, LogOut, Package, LayoutDashboard, UserCircle, Settings } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

export function Header() {
  const { user, userData, signOut, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get cart items directly from store
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get first letter of email for profile icon
  const getProfileInitial = () => {
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout Successful', {
      description: 'You have been logged out successfully.'
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image
                src="/logo.jpg"
                alt="JN Medical Suppliers Logo"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-gray-900">JN Medical</span>
              <span className="block text-xs text-cyan-600 font-medium">SUPPLIERS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors">
              Home
            </Link>
            <Link href="/#products" className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors">
              Products
            </Link>
            {user && (
              <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors">
                My Orders
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {!loading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-9 w-9 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold p-0"
                  >
                    {getProfileInitial()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{userData?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email || user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !loading ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">Sign Up</Button>
                </Link>
              </div>
            ) : null}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Browse pages and account options</SheetDescription>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    href="/" 
                    className="text-lg font-medium text-gray-700 hover:text-cyan-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/#products" 
                    className="text-lg font-medium text-gray-700 hover:text-cyan-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  {user && (
                    <>
                      <Link 
                        href="/profile" 
                        className="text-lg font-medium text-gray-700 hover:text-cyan-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/orders" 
                        className="text-lg font-medium text-gray-700 hover:text-cyan-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link 
                        href="/settings" 
                        className="text-lg font-medium text-gray-700 hover:text-cyan-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          className="text-lg font-medium text-gray-700 hover:text-cyan-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                    </>
                  )}
                  {!user && (
                    <>
                      <hr className="my-2" />
                      <Link 
                        href="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">Sign In</Button>
                      </Link>
                      <Link 
                        href="/signup" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Sign Up</Button>
                      </Link>
                    </>
                  )}
                  {user && (
                    <>
                      <hr className="my-2" />
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
