import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { IconButton, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { toast } from 'sonner'; // ✅ Import toast
import { useAuth } from '@/context/AuthContext';
import { addToCart } from '@/api/cart';
import { getWishlist, addToWishlist, removeFromWishlist } from '@/api/wishlist';
import type { Product, WishlistItem } from '@/types';
import { getProductCategories, getProductImageUrl } from '@/api/products';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import API_BASE from '@/api/client';
import { useUserInvalidate, useUserQuery } from '@/hooks/useQuery';
import { qK } from '@/types/query';

interface ProductCardProps {
  product: Product;
  index?: number;
  onAuthOpen?: () => void;
}

export default function ProductCard(
  { product, index = 0, onAuthOpen }: ProductCardProps
) {
  const { isAuthenticated } = useAuth();
  const { invalidate } = useUserInvalidate();

  const { data: wishlistItems = [] } =
    useUserQuery<WishlistItem[]>(
      qK.wishlist,
      getWishlist,
    );

  const { data: productCategories = [] } = useQuery({
    queryKey: qK.productCatalogue(),
    queryFn: getProductCategories,
  });

  const category = productCategories.find((category) => category.id === product.product_category_id);
  const categoryName = category ? category.name : "Unknown Category";

  const wishlistEntry = wishlistItems.find((w) => w.productId === product.id);
  const isInWishlist = !!wishlistEntry;

  const addCartMutation = useMutation({
    mutationFn: () => addToCart(product.id, 1),
    onSuccess: () => invalidate(qK.cart),
  });

  const addWishlistMutation = useMutation({
    mutationFn: () => addToWishlist(product.id),
    onSuccess: () => invalidate(qK.wishlist),
  });

  const removeWishlistMutation = useMutation({
    mutationFn: () => removeFromWishlist(wishlistEntry!.id),
    onSuccess: () => invalidate(qK.wishlist),
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please Login to add items to your Cart'); // ✅ Toast added
      onAuthOpen?.();
      return;
    }
    addCartMutation.mutate();
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please Login to manage your Wishlist'); // ✅ Toast added
      onAuthOpen?.();
      return;
    }
    if (isInWishlist) removeWishlistMutation.mutate();
    else addWishlistMutation.mutate();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name} - ₹${product.originalPrice.toLocaleString()}`,
      url: `${window.location.origin}/product/${product.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          `${shareData.text}\n\n${shareData.url}`
        )}`,
        "_blank"
      );
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
    >
      <a href={`product/${product.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40 focus-visible:ring-offset-2 rounded-2xl">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f7ecdb]">
          <motion.img
            src={getProductImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading='lazy'
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <IconButton
              size="small"
              onClick={handleWishlistToggle}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' },
                color: isInWishlist ? '#c62828' : '#5c4d3a',
              }}
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
          </div>
        </div>
        <div className="mt-4 px-0.5">
          <p className="text-[#5c4d3a] text-sm font-medium uppercase tracking-wide">
            {categoryName}
          </p>
          <h3 className="mt-1 font-serif text-lg text-[#2c2416] font-normal group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[#2c2416] font-medium">
              ₹{product.originalPrice.toLocaleString()}
            </p>

            <div className="relative group">
              <meta property="og:title" content={product.name} />
              <meta property="og:description" content={product.popularityScore.toLocaleString()} />
              <meta property="og:image" content={getProductImageUrl(product.imageUrl)} />
              <meta property="og:url" content={`${API_BASE}/product/${product.id}`} />
              <IconButton
                sx={{
                  color: '#25D366',
                  '&:hover': { bgcolor: 'rgba(37,211,102,0.08)' }
                }}
                aria-label="Share on WhatsApp"
                onClick={handleShare}>
                <WhatsAppIcon fontSize="inherit" />
              </IconButton>
              <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Share on WhatsApp
              </span>
            </div>
          </div>

          <motion.div className="mt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="small"
              fullWidth
              startIcon={<AddShoppingCartOutlinedIcon />}
              onClick={handleAddToCart}
              disabled={addCartMutation.isPending}
              sx={{
                textTransform: 'none',
                fontFamily: 'DM Sans',
                color: '#5c4d3a',
                borderColor: 'rgba(92,77,58,0.4)',
                '&:hover': { borderColor: '#5c4d3a', bgcolor: 'rgba(92,77,58,0.06)' },
              }}
              variant="outlined"
            >
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </a>
    </motion.article>
  );
}