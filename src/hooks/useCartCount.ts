import { useCartStore } from '@/store/cartStore';
import { useSyncExternalStore } from 'react/use-sync-external-store';

// Custom hook to safely subscribe to cart store
export function useCartCount() {
  const cartCount = useSyncExternalStore(
    useCartStore,
    (store) => store.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  
  return cartCount;
}
