import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  Firestore 
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

// Types
export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface DeliveryAddress {
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'Cash on Delivery';
  deliveryAddress: DeliveryAddress;
  createdAt?: Timestamp;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Helper to get db instance
const getDb = (): Firestore => getFirebaseDb();

// User Services
export const createUser = async (userData: Omit<User, 'createdAt'>) => {
  const db = getDb();
  const userRef = doc(db, 'users', userData.uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp()
  });
  return userData;
};

export const getUserByUid = async (uid: string): Promise<User | null> => {
  try {
    const db = getDb();
    // Try to get the user document directly by UID (document ID)
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as User;
    }
    
    // Fallback: query by uid field (for backwards compatibility)
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const docSnapshot = querySnapshot.docs[0];
    return { id: docSnapshot.id, ...docSnapshot.data() } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const setUserAdmin = async (uid: string) => {
  const db = getDb();
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role: 'admin' });
  } catch {
    // Fallback: query first then update
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { role: 'admin' });
    }
  }
};

// Product Services
export const getProducts = async (): Promise<Product[]> => {
  try {
    const db = getDb();
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array if collection doesn't exist or index needed
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const db = getDb();
  const docRef = doc(db, 'products', id);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return null;
  
  return { id: snapshot.id, ...snapshot.data() } as Product;
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = getDb();
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: docRef.id, ...product };
};

export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
  const db = getDb();
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: serverTimestamp()
  });
};

export const deleteProduct = async (id: string) => {
  const db = getDb();
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

// Order Services
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  const db = getDb();
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...orderData };
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const db = getDb();
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const db = getDb();
    const ordersRef = collection(db, 'orders');
    
    // Try with compound query first (requires index)
    try {
      const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (indexError) {
      console.warn('Index not available, falling back to simple query:', indexError);
      
      // Fallback: Simple query without orderBy (doesn't require index)
      const simpleQ = query(ordersRef, where('userId', '==', userId));
      const snapshot = await getDocs(simpleQ);
      
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Sort in memory by createdAt (descending)
      return orders.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']) => {
  const db = getDb();
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status });
};
