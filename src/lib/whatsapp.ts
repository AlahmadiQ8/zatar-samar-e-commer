import { CartItem, CustomerInfo } from './types';

// WhatsApp business phone number (Kuwait format)
const WHATSAPP_PHONE = '+96565544219';

export function generateWhatsAppMessage(
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  subtotal: number
): string {
  const lines: string[] = [];
  
  // Greeting
  lines.push('مرحبا، هذا طلبي من زعتر سمر:');
  lines.push('');
  
  // Order items
  cartItems.forEach(item => {
    const total = item.price * item.quantity;
    lines.push(`${item.productTitle} - ${item.variantTitle} × ${item.quantity}`);
    lines.push(`السعر: ${total.toFixed(3)} دينار كويتي`);
    lines.push('');
  });
  
  // Subtotal
  lines.push(`إجمالي المنتجات: ${subtotal.toFixed(3)} دينار كويتي`);
  lines.push('');
  
  // Delivery method
  if (customerInfo.deliveryMethod === 'delivery') {
    lines.push('طريقة الاستلام: توصيل');
    lines.push('رسوم التوصيل حسب المنطقة');
  } else {
    lines.push('طريقة الاستلام: استلام من المتجر');
    lines.push('العنوان: السالمية، قطعة 3، شارع 308، منزل 7');
  }
  lines.push('');
  
  // Payment method
  const paymentText = customerInfo.paymentMethod === 'cash' ? 'دفع كاش' : 'دفع أونلاين (عن طريق Link)';
  lines.push(`طريقة الدفع: ${paymentText}`);
  lines.push('');
  
  // Customer name
  lines.push(`الفاتورة باسم: ${customerInfo.name}`);
  
  return lines.join('\n');
}

export function generateWhatsAppUrl(
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  subtotal: number
): string {
  const message = generateWhatsAppMessage(cartItems, customerInfo, subtotal);
  const encodedMessage = encodeURIComponent(message);
  
  // Use web URL for better compatibility
  return `https://wa.me/${WHATSAPP_PHONE.replace('+', '')}?text=${encodedMessage}`;
}

export function openWhatsApp(
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  subtotal: number
): void {
  const url = generateWhatsAppUrl(cartItems, customerInfo, subtotal);
  window.open(url, '_blank');
}

export function copyMessageToClipboard(
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  subtotal: number
): Promise<void> {
  const message = generateWhatsAppMessage(cartItems, customerInfo, subtotal);
  return navigator.clipboard.writeText(message);
}

// Format price in Kuwaiti Dinars
export function formatPrice(amount: string | number, currencyCode: string = 'KWD'): string {
  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${price.toFixed(3)} د.ك`;
}

// Get pickup location with Google Maps link
export function getPickupLocation(): { address: string; mapsUrl: string } {
  const address = 'السالمية، قطعة 3، شارع 308، منزل 7';
  const mapsUrl = 'https://maps.google.com?q=السالمية،+قطعة+3،+شارع+308،+منزل+7';
  
  return { address, mapsUrl };
}