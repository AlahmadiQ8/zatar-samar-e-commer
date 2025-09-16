import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/types';
import { fetchProducts } from '@/lib/shopify';
import logoSvg from '@/assets/images/logo-placeholder.svg';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('حدث خطأ في تحميل المنتجات');
        console.error('Error loading products:', err);
        // Set empty products array so UI still renders
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    // Add a small delay to ensure UI renders first
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const retryLoad = () => {
    setError(null);
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((err) => {
        setError('حدث خطأ في تحميل المنتجات');
        console.error('Error loading products:', err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section - Always visible */}
      <section className="text-center mb-4 md:mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 flex items-center justify-center">
            <img src={logoSvg} alt="زعتر سمر" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            زعتر سمر
          </h1>
          <p className="text-xl text-muted-foreground mb-6">منتجات شامية أصيلة من أجود المكونات الطبيعية</p>
        </div>
      </section>
      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-2">منتجاتنا</h2>
          {error && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={retryLoad}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </Button>
          )}
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium mb-2">خطأ في التحميل</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={retryLoad} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-lg font-medium mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground">
              سيتم إضافة منتجات جديدة قريباً
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      {/* Footer CTA */}
      <section className="text-center mt-16 py-12 bg-muted/30 rounded-2xl">
        <h3 className="text-2xl font-bold mb-4">
          هل تحتاج مساعدة في الاختيار؟
        </h3>
        <p className="text-muted-foreground mb-6">
          تواصل معنا عبر الواتساب للحصول على استشارة مجانية
        </p>
        <Button 
          size="lg"
          onClick={() => window.open('https://wa.me/+96565544219', '_blank')}
          className="gap-2"
        >
          <span>📱</span>
          تواصل معنا
        </Button>
      </section>
    </div>
  );
}