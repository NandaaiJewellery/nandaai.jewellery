import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchProducts } from '@/api/products';
import type { SortOption } from '@/types';
import ProductCard from '@/components/ProductCard';
import { qK } from '@/types/query';

interface OutletContext {
  category: string;
  sort: SortOption;
  search: string;
  onAuthOpen?: () => void;
}

export default function ProductGrid() {
  const { category, sort, search, onAuthOpen } = useOutletContext<OutletContext>();
  const { data: products = [], isLoading } = useQuery({
    queryKey: qK.allProducts({ category, sort, search }),
    queryFn: () => fetchProducts({ category: category || undefined, sort }),
  });

  const filtered = search.trim()
    ? products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        String(p.product_category_id).includes(search)
    )
    : products;

  return (
    <section id="products" className="lg:pl-16 lg:pr-16 px-4 py-16 md:py-24 w-full mx-auto bg-[#f6f2ec]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
      >
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-[#ebe8e3] animate-pulse"
            />
          ))
        ) : (
          filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onAuthOpen={onAuthOpen} />
          ))
        )}
      </motion.div>
      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-[#5c4d3a]/80 py-12">No products match your filters.</p>
      )}
    </section>
  );
}
