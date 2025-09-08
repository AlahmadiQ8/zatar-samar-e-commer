import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { Cart, CartItem } from '../lib/types';

interface CartState {
  cart: Cart;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productHandle: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productHandle: string; variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: Cart };

const initialState: CartState = {
  cart: {
    items: [],
    subtotal: 0
  },
  isOpen: false
};

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.cart.items.findIndex(
        item => item.productHandle === action.payload.productHandle && 
                item.variantId === action.payload.variantId
      );

      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        updatedItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.cart.items, action.payload];
      }

      const updatedCart = {
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems)
      };

      return {
        ...state,
        cart: updatedCart
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.cart.items.filter(
        item => !(item.productHandle === action.payload.productHandle && 
                 item.variantId === action.payload.variantId)
      );
      
      const updatedCart = {
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems)
      };

      return {
        ...state,
        cart: updatedCart
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.cart.items.map(item =>
        item.productHandle === action.payload.productHandle && 
        item.variantId === action.payload.variantId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const updatedCart = {
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems)
      };

      return {
        ...state,
        cart: updatedCart
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          items: [],
          subtotal: 0
        }
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload
      };

    case 'LOAD_CART':
      return {
        ...state,
        cart: action.payload
      };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productHandle: string, variantId: string) => void;
  updateQuantity: (productHandle: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('zatar-samar-cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zatar-samar-cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    
    // Show success toast in Arabic
    toast.success(`تمت إضافة ${item.productTitle} إلى السلة`, {
      description: `الكمية: ${item.quantity}`,
      duration: 3000,
    });
  };

  const removeItem = (productHandle: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productHandle, variantId } });
  };

  const updateQuantity = (productHandle: string, variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productHandle, variantId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen });
  };

  const getTotalItems = () => {
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        getTotalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}