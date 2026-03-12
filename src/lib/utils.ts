import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price in Indian Rupees (₹)
 * Uses Indian number system with lakhs and crores formatting
 * Examples: ₹499, ₹1,299, ₹10,000, ₹1,00,000
 */
export function formatPrice(price: number): string {
  // Indian number formatting
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(price);
}
