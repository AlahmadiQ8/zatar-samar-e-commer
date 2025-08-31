import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash, ArrowRight } from '@phosphor-icons/react';
import { useCart } from '@/hooks/useCart';
import { formatPrice, openWhatsApp, getPickupLocation } from '@/lib/whatsapp';
import { CustomerInfo } from '@/lib/types';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { state, updateQuantity, removeItem } = useCart();
  const { cart } = state;
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    deliveryMethod: 'delivery',
    paymentMethod: 'cash'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return <Navigate to="/" replace />;
  }

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

  const handleSubmitOrder = async () => {
    if (!customerInfo.name.trim()) {
      toast.error('يرجى إدخال اسم الفاتورة');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('السلة فارغة');
      return;
    }

    setIsSubmitting(true);

    try {
      openWhatsApp(cart.items, customerInfo, cart.subtotal);
      toast.success('تم فتح الواتساب لإرسال طلبك');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error('حدث خطأ في فتح الواتساب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickup = getPickupLocation();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">إتمام الطلب</h1>
          <p className="text-muted-foreground">
            راجع طلبك وأدخل بياناتك لإرسال الطلب عبر الواتساب
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mx-auto max-w-5xl">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>طلبك ({cart.items.length} منتج)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div key={`${item.productHandle}-${item.variantId}`} className="flex gap-4 p-4 rounded-lg border">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xl font-bold text-muted-foreground opacity-50">
                          {item.productTitle.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1">{item.productTitle}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{item.variantTitle}</p>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.productHandle, item.variantId, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Badge variant="secondary" className="px-3">
                        {item.quantity}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.productHandle, item.variantId, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive mr-auto"
                        onClick={() => handleRemoveItem(item.productHandle, item.variantId)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-left">
                    <p className="font-medium arabic-number">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-muted-foreground arabic-number">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-4">
                <Button variant="outline" asChild>
                  <Link to="/">إضافة منتجات أخرى</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Info & Checkout */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>بيانات الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">الفاتورة باسم من؟ *</Label>
                <Input
                  id="customer-name"
                  placeholder="اكتب اسمك هنا"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="text-right"
                />
              </div>

              <Separator />

              {/* Delivery Method */}
              <div className="space-y-3">
                <Label>طريقة الاستلام</Label>
                <RadioGroup
                  value={customerInfo.deliveryMethod}
                  onValueChange={(value: 'delivery' | 'pickup') => 
                    setCustomerInfo(prev => ({ ...prev, deliveryMethod: value }))
                  }
                  className="gap-4"
                >
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="text-right">
                        <div className="font-medium">توصيل</div>
                        <div className="text-sm text-muted-foreground">
                          رسوم التوصيل حسب المنطقة
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="text-right">
                        <div className="font-medium">استلام من المتجر</div>
                        <div className="text-sm text-muted-foreground">
                          {pickup.address}
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {customerInfo.deliveryMethod === 'pickup' && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={pickup.mapsUrl} target="_blank" rel="noopener noreferrer">عرض الموقع على الخريطة</a>
                  </Button>
                )}
              </div>

              <Separator />

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>طريقة الدفع</Label>
                <RadioGroup
                  value={customerInfo.paymentMethod}
                  onValueChange={(value: 'cash' | 'online') => 
                    setCustomerInfo(prev => ({ ...prev, paymentMethod: value }))
                  }
                  className="gap-4"
                >
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="cursor-pointer">كاش</Label>
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="cursor-pointer">أونلاين (عن طريق Link)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-medium arabic-number">
                  {formatPrice(cart.subtotal)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>رسوم التوصيل:</span>
                <span>حسب المنطقة</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>المجموع:</span>
                <span className="arabic-number">{formatPrice(cart.subtotal)}+</span>
              </div>

              <Button 
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !customerInfo.name.trim()}
                className="w-full gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  'جاري الإرسال...'
                ) : (
                  <>
                    <span>📱</span>
                    ارسل الطلب عبر الواتساب
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                سيتم فتح الواتساب مع رسالة تحتوي على تفاصيل طلبك
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}