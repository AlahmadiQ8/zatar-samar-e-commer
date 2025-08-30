import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { fetchProduct } from '@/lib/shopify';
import { formatPrice, generateWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/hooks/useCart';

export function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      
      try {
        setLoading(true);
        const fetchedProduct = await fetchProduct(handle);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setSelectedVariantId(fetchedProduct.variants[0]?.id || '');
          setError(null);
        } else {
          setError('المنتج غير موجود');
        }
      } catch (err) {
        setError('حدث خطأ في تحميل المنتج');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [handle]);

  if (!handle) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-lg font-medium mb-2">خطأ في التحميل</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.history.back()}>
            العودة للخلف
          </Button>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
  const canAddToCart = selectedVariant && selectedVariant.availableForSale;

  const handleAddToCart = () => {
    if (canAddToCart) {
      addItem({
        productHandle: product.handle,
        productTitle: product.title,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: parseFloat(selectedVariant.price.amount),
        quantity,
        image: product.featuredImage?.url
      });
    }
  };

  const handleQuickOrder = () => {
    if (canAddToCart) {
      const cartItems = [{
        productHandle: product.handle,
        productTitle: product.title,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: parseFloat(selectedVariant.price.amount),
        quantity,
        image: product.featuredImage?.url
      }];

      const customerInfo = {
        name: '',
        deliveryMethod: 'delivery' as const,
        paymentMethod: 'cash' as const
      };

      const subtotal = parseFloat(selectedVariant.price.amount) * quantity;
      const whatsappUrl = generateWhatsAppUrl(cartItems, customerInfo, subtotal);
      window.open(whatsappUrl, '_blank');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, selectedVariant?.quantityAvailable || 999));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            {product.featuredImage ? (
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground opacity-30">
                  {product.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Additional Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={image.url}
                    alt={image.altText || `${product.title} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Price */}
          <div>
            <div className="text-3xl font-bold text-primary mb-2 arabic-number">
              {selectedVariant ? formatPrice(selectedVariant.price.amount) : formatPrice(product.priceRange.minVariantPrice.amount)}
            </div>
            {selectedVariant && !selectedVariant.availableForSale && (
              <Badge variant="destructive">غير متوفر</Badge>
            )}
          </div>

          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">اختر الحجم:</h3>
                <RadioGroup
                  value={selectedVariantId}
                  onValueChange={setSelectedVariantId}
                  className="space-y-2"
                >
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={variant.id}
                        id={variant.id}
                        disabled={!variant.availableForSale}
                        className="order-1"
                      />
                      <Label
                        htmlFor={variant.id}
                        className="flex-1 flex justify-between items-center cursor-pointer order-2"
                      >
                        <span>{variant.title}</span>
                        <span className="arabic-number text-sm font-medium">
                          {formatPrice(variant.price.amount)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Quantity Selection */}
          <div>
            <h3 className="font-semibold mb-3">الكمية:</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                {quantity}
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                disabled={quantity >= (selectedVariant?.quantityAvailable || 999)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="w-full gap-2"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5" />
              إضافة إلى السلة
            </Button>
            
            <Button
              onClick={handleQuickOrder}
              disabled={!canAddToCart}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              <span>📱</span>
              طلب سريع عبر الواتساب
            </Button>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>التوفر:</span>
              <span className="font-medium">
                {selectedVariant?.availableForSale ? 'متوفر' : 'غير متوفر'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل:</span>
              <span className="font-medium">حسب المنطقة</span>
            </div>
            <div className="flex justify-between">
              <span>طرق الدفع:</span>
              <span className="font-medium">كاش أو أونلاين</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}