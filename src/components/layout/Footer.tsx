import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative h-14 w-14">
                <Image
                  src="/logo.jpg"
                  alt="JN Medical Suppliers Logo"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">JN Medical</h3>
                <span className="text-cyan-400 text-sm font-medium">SUPPLIERS</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted partner for quality medical supplies. We provide a wide range of 
              medical equipment and supplies with free delivery to ensure healthcare 
              professionals have what they need.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full font-medium">
                FREE DELIVERY
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#products" className="hover:text-cyan-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-cyan-400 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-400" />
                <a href="tel:+918840989780" className="hover:text-cyan-400 transition-colors">
                  +91 8840989780
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <a href="mailto:jnmedicalsuppliers@gmail.com" className="hover:text-cyan-400 transition-colors">
                  jnmedicalsuppliers@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-cyan-400 mt-1" />
                <span>Padari Bazar, Mohanapur<br />Gorakhpur, 274701<br />India</span>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} JN Medical Suppliers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
