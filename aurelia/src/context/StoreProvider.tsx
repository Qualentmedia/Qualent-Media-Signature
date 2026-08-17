'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import type { CartLine } from '@/lib/types';
import { getProductById } from '@/lib/products';

/* ------------------------------------------------------------------ */
/*  Store: cart + wishlist, persisted to localStorage.                 */
/*  A single provider keeps client state minimal and tree-shakeable.   */
/* ------------------------------------------------------------------ */

interface StoreState {
  cart: CartLine[];
  wishlist: string[];
}

type Action =
  | { type: 'HYDRATE'; payload: StoreState }
  | { type: 'ADD_TO_CART'; productId: string; quantity: number }
  | { type: 'SET_QTY'; productId: string; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; productId: string };

const initialState: StoreState = { cart: [], wishlist: [] };

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD_TO_CART': {
      const existing = state.cart.find((l) => l.productId === action.productId);
      const cart = existing
        ? state.cart.map((l) =>
            l.productId === action.productId
              ? { ...l, quantity: l.quantity + action.quantity }
              : l,
          )
        : [...state.cart, { productId: action.productId, quantity: action.quantity }];
      return { ...state, cart };
    }
    case 'SET_QTY': {
      const cart = state.cart
        .map((l) =>
          l.productId === action.productId ? { ...l, quantity: action.quantity } : l,
        )
        .filter((l) => l.quantity > 0);
      return { ...state, cart };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((l) => l.productId !== action.productId) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_WISHLIST': {
      const inList = state.wishlist.includes(action.productId);
      return {
        ...state,
        wishlist: inList
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      };
    }
    default:
      return state;
  }
}

interface StoreContextValue extends StoreState {
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);
const STORAGE_KEY = 'aurelia.store.v1';

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isCartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) as StoreState });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', productId, quantity });
    setCartOpen(true);
  }, []);
  const setQuantity = useCallback(
    (productId: string, quantity: number) => dispatch({ type: 'SET_QTY', productId, quantity }),
    [],
  );
  const removeFromCart = useCallback(
    (productId: string) => dispatch({ type: 'REMOVE_FROM_CART', productId }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleWishlist = useCallback(
    (productId: string) => dispatch({ type: 'TOGGLE_WISHLIST', productId }),
    [],
  );
  const isWishlisted = useCallback(
    (productId: string) => state.wishlist.includes(productId),
    [state.wishlist],
  );

  const { cartCount, subtotal } = useMemo(() => {
    let count = 0;
    let sum = 0;
    for (const line of state.cart) {
      const product = getProductById(line.productId);
      if (!product) continue;
      count += line.quantity;
      sum += product.price * line.quantity;
    }
    return { cartCount: count, subtotal: sum };
  }, [state.cart]);

  const value: StoreContextValue = {
    ...state,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    cartCount,
    wishlistCount: state.wishlist.length,
    subtotal,
    isCartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>');
  return ctx;
}
