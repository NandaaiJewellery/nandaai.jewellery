import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import { getCart } from '@/api/cart';
import { getWishlist } from '@/api/wishlist';
import type { CartItem, SortOption, WishlistItem } from '@/types';
import Footer from '@/components/Footer';
import { useUserQuery } from '@/hooks/useQuery';
import { qK } from '@/types/query';

export default function Layout() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('popularity');
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const { data: cartItems = [] } =
    useUserQuery<CartItem[]>(
      qK.cart,
      getCart,
    );

  const { data: wishlistItems = [] } =
    useUserQuery<WishlistItem[]>(
      qK.wishlist,
      getWishlist,
    );

  const cartCount =
    cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        category={category}
        sort={sort}
        search={search}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onSearchChange={setSearch}
        onWishlistOpen={() => setWishlistOpen(true)}
        onCartOpen={() => setCartOpen(true)}
        onProfileClick={() => setAuthOpen(true)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      <main className="flex-grow" style={{ paddingTop: 88 }}>
        <Outlet context={{ category, sort, search, onAuthOpen: () => setAuthOpen(true) }} />
      </main>

      <Footer
        onAuthOpen={() => setAuthOpen(true)}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
      />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          navigate('/checkout');
        }}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onCartOpen={() => setCartOpen(true)}
      />
    </div>
  );
}

