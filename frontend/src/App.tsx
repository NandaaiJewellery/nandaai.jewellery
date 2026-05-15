import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CheckoutPage from '@/pages/CheckoutPage';
import Orders from '@/pages/OrdersPage';
import ProductPage from '@/pages/ProductPage';
import { Toaster } from "sonner";

function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <ProductGrid />
      </main>
    </>
  );
}

function App() {
  return (
    <motion.div
      className="min-h-screen bg-[#fafaf9]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Toaster richColors position="top-right" />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="product/:id" element={<ProductPage />} />
        </Route>
      </Routes>
    </motion.div>
  );
}

export default App;
