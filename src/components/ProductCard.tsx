import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from '@phosphor-icons/react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/whatsapp';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];
    if (defaultVariant) {
      addItem({
        productHandle: product.handle,
        productTitle: product.title,
        variantId: defaultVariant.id,
        variantTitle: defaultVariant.title,
        price: parseFloat(defaultVariant.price.amount),
        quantity: 1,
        image: product.featuredImage?.url
      });
    }
  };

  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const showPriceRange = minPrice !== maxPrice;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product.handle}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground opacity-50">
                {product.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground">
            {product.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="font-bold text-primary">
              {showPriceRange ? (
                <span className="arabic-number">
                  {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                </span>
              ) : (
                <span className="arabic-number">
                  {formatPrice(minPrice)}
                </span>
              )}
            </div>

            {product.variants.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                {product.variants.length} خيار
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={quickAdd}
            className="w-full gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            إضافة سريعة
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}