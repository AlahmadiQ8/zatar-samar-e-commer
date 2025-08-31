import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { Product, ShopifyResponse } from './types';

const SHOPIFY_DOMAIN = 'zatarsamar.myshopify.com';
const STOREFRONT_TOKEN = 'demo-token'; // In production, this would come from env
const API_VERSION = '2024-10';

const client = createStorefrontApiClient({
  storeDomain: SHOPIFY_DOMAIN,
  apiVersion: API_VERSION,
  publicAccessToken: STOREFRONT_TOKEN,
});

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export async function fetchProducts(): Promise<Product[]> {
  try {
    // Timeout the request after 5 seconds to prevent infinite loading
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 5000)
    );
    
    const requestPromise = client.request(PRODUCTS_QUERY, {
      variables: { first: 20 }
    });
    
    const { data } = await Promise.race([requestPromise, timeoutPromise]);
    
    return data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      description: edge.node.description,
      featuredImage: edge.node.featuredImage,
      images: edge.node.images.edges.map((img: any) => img.node),
      variants: edge.node.variants.edges.map((variant: any) => variant.node),
      priceRange: edge.node.priceRange,
    }));
  } catch (error) {
    console.warn('Shopify API unavailable, using mock data:', error);
    // Return mock data for development
    return getMockProducts();
  }
}

export async function fetchProduct(handle: string): Promise<Product | null> {
  try {
    // Timeout the request after 5 seconds to prevent infinite loading
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 5000)
    );
    
    const requestPromise = client.request(PRODUCT_QUERY, {
      variables: { handle }
    });
    
    const { data } = await Promise.race([requestPromise, timeoutPromise]);
    
    if (!data.product) return null;
    
    return {
      id: data.product.id,
      handle: data.product.handle,
      title: data.product.title,
      description: data.product.description,
      featuredImage: data.product.featuredImage,
      images: data.product.images.edges.map((img: any) => img.node),
      variants: data.product.variants.edges.map((variant: any) => variant.node),
      priceRange: data.product.priceRange,
    };
  } catch (error) {
    console.warn('Shopify API unavailable, using mock data:', error);
    // Return mock data for development
    const mockProducts = getMockProducts();
    return mockProducts.find(p => p.handle === handle) || null;
  }
}

// Mock data for development
function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      handle: 'zatar-premium-palestinian',
      title: 'زعتر فاخر فلسطيني',
      description: 'زعتر طبيعي من أجود أنواع الزعتر الفلسطيني، محضر بعناية فائقة مع زيت الزيتون البكر الممتاز والسمسم المحمص',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
        altText: 'زعتر فلسطيني'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          altText: 'زعتر فلسطيني'
        }
      ],
      variants: [
        {
          id: 'v1',
          title: 'ربع كيلو',
          price: { amount: '3.500', currencyCode: 'KWD' },
          availableForSale: true,
          quantityAvailable: 50
        },
        {
          id: 'v2',
          title: 'نصف كيلو',
          price: { amount: '6.500', currencyCode: 'KWD' },
          availableForSale: true,
          quantityAvailable: 30
        }
      ],
      priceRange: {
        minVariantPrice: { amount: '3.500', currencyCode: 'KWD' },
        maxVariantPrice: { amount: '6.500', currencyCode: 'KWD' }
      }
    },
    {
      id: '2',
      handle: 'olive-oil-extra-virgin',
      title: 'زيت زيتون بكر ممتاز',
      description: 'زيت زيتون عضوي بكر ممتاز من بساتين شمال فلسطين، مُستخرج على البارد للحفاظ على النكهة والفوائد الغذائية',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
        altText: 'زيت زيتون'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
          altText: 'زيت زيتون'
        }
      ],
      variants: [
        {
          id: 'v3',
          title: '500 مل',
          price: { amount: '8.000', currencyCode: 'KWD' },
          availableForSale: true,
          quantityAvailable: 25
        },
        {
          id: 'v4',
          title: '1 لتر',
          price: { amount: '15.000', currencyCode: 'KWD' },
          availableForSale: true,
          quantityAvailable: 15
        }
      ],
      priceRange: {
        minVariantPrice: { amount: '8.000', currencyCode: 'KWD' },
        maxVariantPrice: { amount: '15.000', currencyCode: 'KWD' }
      }
    },
    {
      id: '3',
      handle: 'sumac-ground',
      title: 'سماق مطحون',
      description: 'سماق حامض طبيعي مطحون ناعم، يضيف نكهة حامضة مميزة للسلطات والأطباق الشامية',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
        altText: 'سماق'
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          altText: 'سماق'
        }
      ],
      variants: [
        {
          id: 'v5',
          title: '200 غرام',
          price: { amount: '2.500', currencyCode: 'KWD' },
          availableForSale: true,
          quantityAvailable: 40
        }
      ],
      priceRange: {
        minVariantPrice: { amount: '2.500', currencyCode: 'KWD' },
        maxVariantPrice: { amount: '2.500', currencyCode: 'KWD' }
      }
    }
  ];
}