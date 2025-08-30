export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
    altText: string;
  };
  images: {
    url: string;
    altText: string;
  }[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  quantityAvailable: number;
}

export interface CartItem {
  productHandle: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
}

export interface CustomerInfo {
  name: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'online';
}

export interface ShopifyResponse<T> {
  data: T;
  errors?: any[];
}