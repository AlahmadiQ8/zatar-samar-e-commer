import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { fetchProducts } from '@/lib/shopify';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError('حدث خطأ في تحميل المنتجات');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium mb-2">خطأ في التحميل</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-3xl">ز</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            زعتر سمر
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            منتجات شامية أصيلة من أجود المكونات الطبيعية
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            اكتشف نكهات بلاد الشام الأصيلة مع مجموعتنا المميزة من الزعتر وزيت الزيتون والتوابل الطبيعية
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">منتجاتنا</h2>
            <p className="text-muted-foreground">
              اختر من تشكيلة متنوعة من المنتجات الشامية الأصيلة
            </p>
          </div>
        </div>

        {products.length === 0 ? (
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