import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Phone } from '@phosphor-icons/react';
import { useCart } from '@/hooks/useCart';

export function Header() {
  const { getTotalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/+96565544219', '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">ز</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">زعتر سمر</h1>
            <p className="text-sm text-muted-foreground">منتجات شامية أصيلة</p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* WhatsApp Contact */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleWhatsAppContact}
            className="hidden sm:flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>اتصل بنا</span>
          </Button>

          {/* Cart Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleCart}
            className="relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* Mobile WhatsApp */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleWhatsAppContact}
            className="sm:hidden"
          >
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}