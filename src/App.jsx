import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { ScrollReset, ScrollToTopButton } from '@/components/layout/ScrollToTop';
import { FuseRail } from '@/components/ui/Atmosphere';
import { RouteLoader } from '@/components/ui/primitives';

/* The homepage is the common entry point, so it ships in the first chunk.
   Everything else is split — the price list pulls in the whole catalogue,
   and the cart pulls in the WhatsApp builder, neither of which a visitor
   needs before they ask for them. */
import Home from '@/pages/Home';

const Products = lazy(() => import('@/pages/Products'));
const Categories = lazy(() => import('@/pages/Categories'));
const CategoryDetail = lazy(() => import('@/pages/Categories').then((m) => ({ default: m.CategoryDetail })));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Combos = lazy(() => import('@/pages/Combos'));
const Cart = lazy(() => import('@/pages/Cart'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/combos" element={<Combos />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ScrollReset />
      <Header />
      <FuseRail />
      <AnimatedRoutes />
      <Footer />
      <CartDrawer />
      <ScrollToTopButton />
    </CartProvider>
  );
}
