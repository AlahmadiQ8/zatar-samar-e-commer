import { CartItem, CustomerInfo } from './types';

// WhatsApp business phone number (Kuwait format)
const WHATSAPP_PHONE = '+96565544219';

export function generateWhatsAppMessage(
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  subtotal: number
): string {
  const lines: string[] = [];
  
  // Header with emojis
  const headerTitle = '🌿 مرحبا، هذا طلبي من زعتر سمر 🌿';
  lines.push(headerTitle);
  lines.push('═'.repeat(32)); // Match header length
  lines.push('');
  
  // Order items with emojis
  const orderTitle = '📦 *تفاصيل الطلب:*';
  lines.push(orderTitle);
  lines.push('━'.repeat(16)); // Match order title length
  cartItems.forEach((item, index) => {
    const total = item.price * item.quantity;
    lines.push(`${index + 1}. 🛒 ${item.productTitle}`);
    lines.push(`   📏 النوع: ${item.variantTitle}`);
    lines.push(`   🔢 الكمية: ${item.quantity}`);
    lines.push(`   💰 السعر: ${total.toFixed(3)} د.ك`);
    lines.push('');
  });
  lines.push('');
  
  // Subtotal with separator
  const totalTitle = '💳 *الإجمالي:*';
  lines.push(totalTitle);
  lines.push('━'.repeat(12)); // Match total title length
  lines.push(`🏷️ إجمالي المنتجات: ${subtotal.toFixed(3)} د.ك`);
  lines.push('');
  
  // Delivery method with icons
  const deliveryTitle = '🚚 *طريقة الاستلام:*';
  lines.push(deliveryTitle);
  lines.push('━'.repeat(17)); // Match delivery title length
  if (customerInfo.deliveryMethod === 'delivery') {
    lines.push('📦 توصيل إلى العنوان');
    if (customerInfo.address) {
      lines.push(`📍 العنوان: ${customerInfo.address}`);
    }
    lines.push('⚠️ رسوم التوصيل حسب المنطقة');
  } else {
    lines.push('🏪 استلام من المتجر');
    lines.push('📍 العنوان: الفنيطيس، قطعة 3، شارع 308، منزل 7');
  }
  lines.push('');
  
  // Payment method with icons
  const paymentTitle = '💳 *طريقة الدفع:*';
  lines.push(paymentTitle);
  lines.push('━'.repeat(15)); // Match payment title length
  const paymentIcon = customerInfo.paymentMethod === 'cash' ? '💵' : '💳';
  const paymentText = customerInfo.paymentMethod === 'cash' ? 'دفع كاش' : 'دفع أونلاين (ومض)';
  lines.push(`${paymentIcon} ${paymentText}`);
  lines.push('');
  
  // Customer info
  const customerTitle = '👤 *بيانات العميل:*';
  lines.push(customerTitle);
  lines.push('━'.repeat(16)); // Match customer title length
  lines.push(`📝 الفاتورة باسم: ${customerInfo.name}`);
  lines.push('');
  
  // Footer
  const footerTitle = '🙏 شكراً لاختيارك زعتر سمر';
  lines.push('═'.repeat(24)); // Match footer length
  lines.push(footerTitle);
  lines.push('🌿 منتجات شامية أصيلة 🌿');
  
  return lines.join('\n');
}

export function generateWhatsAppUrl(
  cartItems: CartItem[],
  customerInfo: CustomerInfo,
  subtotal: number
): string {
  const message = generateWhatsAppMessage(cartItems, customerInfo, subtotal);
  const encodedMessage = encodeURIComponent(message);
  
  // Extract phone number without + for the new URL format
  const phoneNumber = WHATSAPP_PHONE.replace('+', '');
  
  // Use new WhatsApp API format
  return `https://api.whatsapp.com/send/?phone=%2B${phoneNumber}&text=${encodedMessage}`;
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
  const address = 'الفنيطيس، قطعة 3، شارع 308، منزل 7';
  const mapsUrl = 'https://maps.app.goo.gl/zD1ZHPPJ5NKsE3u66';
  
  return { address, mapsUrl };
}