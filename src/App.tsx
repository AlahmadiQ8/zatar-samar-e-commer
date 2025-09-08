import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/hooks/useCart';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { HomePage } from '@/components/HomePage';
import { ProductPage } from '@/components/ProductPage';
import { CheckoutPage } from '@/components/CheckoutPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:handle" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>
          <CartDrawer />
          <Toaster 
            position="bottom-center"
            dir="rtl"
            richColors
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;