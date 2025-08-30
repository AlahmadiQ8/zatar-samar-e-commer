import React from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash } from '@phosphor-icons/react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/whatsapp';

export function CartDrawer() {
  const { state, updateQuantity, removeItem, setCartOpen } = useCart();
  const { cart, isOpen } = state;

  const handleQuantityChange = (productHandle: string, variantId: string, delta: number) => {
    const item = cart.items.find(item => 
      item.productHandle === productHandle && item.variantId === variantId
    );
    if (item) {
      updateQuantity(productHandle, variantId, item.quantity + delta);
    }
  };

  const handleRemoveItem = (productHandle: string, variantId: string) => {
    removeItem(productHandle, variantId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>سلة المشتريات</SheetTitle>
          <SheetDescription>
            {cart.items.length > 0 
              ? `${cart.items.length} منتج في سلتك`
              : 'سلة المشتريات فارغة'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-lg font-medium mb-2">سلة فارغة</h3>
              <p className="text-muted-foreground mb-4">ابدأ بإضافة منتجات إلى سلتك</p>
              <Button onClick={() => setCartOpen(false)}>
                تصفح المنتجات
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={`${item.productHandle}-${item.variantId}`} className="flex gap-3 p-3 rounded-lg border">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.productTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-bold text-muted-foreground opacity-50">
                            {item.productTitle.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{item.productTitle}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{item.variantTitle}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(item.productHandle, item.variantId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <Badge variant="secondary" className="px-2">
                            {item.quantity}
                          </Badge>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(item.productHandle, item.variantId, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive"
                          onClick={() => handleRemoveItem(item.productHandle, item.variantId)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-left">
                      <p className="font-medium text-sm arabic-number">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">المجموع الفرعي:</span>
                  <span className="font-bold text-primary arabic-number">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  رسوم التوصيل حسب المنطقة
                </p>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout" onClick={() => setCartOpen(false)}>
                    إتمام الطلب عبر الواتساب
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCartOpen(false)}
                >
                  مواصلة التسوق
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}