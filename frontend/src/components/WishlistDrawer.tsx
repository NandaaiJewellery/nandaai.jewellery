import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getWishlist, removeFromWishlist } from '@/api/wishlist';
import { addToCart } from '@/api/cart';
import type { WishlistItem } from '@/types';
import { getProductImageUrl } from '@/api/products';
import { qK } from '@/types/query';
import { useUserInvalidate, useUserQuery } from '@/hooks/useQuery';
import { useAuth } from '@/context/AuthContext';

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  onCartOpen: () => void;
}

function WishlistLine({
  item,
  onAddToCart,
  onRemove,
}: {
  item: WishlistItem;
  onAddToCart: () => void;
  onRemove: () => void;
}) {
  const product = item.Product;
  if (!product) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-4 border-b border-[#ebe8e3] last:border-0"
    >
      <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#f5f2ed] flex-shrink-0">
        <img src={getProductImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[#2c2416] font-medium truncate">{product.name}</p>
        <p className="text-[#2c2416] font-medium mt-1">₹{product.discountedPrice.toLocaleString()}</p>
        <Button
          size="small"
          onClick={onAddToCart}
          sx={{
            mt: 1,
            textTransform: 'none',
            fontFamily: 'DM Sans',
            color: '#5c4d3a',
            borderColor: 'rgba(92,77,58,0.4)',
            '&:hover': { borderColor: '#5c4d3a', backgroundColor: 'rgba(92,77,58,0.06)' },
          }}
          variant="outlined"
        >
          Add to Cart
        </Button>
      </div>
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{ color: '#8a7a65', '&:hover': { color: '#c62828' } }}
        aria-label="Remove from wishlist"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </motion.div>
  );
}

export default function WishlistDrawer({ open, onClose, onCartOpen }: WishlistDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { invalidate } = useUserInvalidate();
  const { isAuthenticated } = useAuth();

  const { data: items = [], isLoading } =
    useUserQuery<WishlistItem[]>(
      qK.wishlist,
      getWishlist,
      { enabled: open }
    );

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeFromWishlist(itemId),
    onSuccess: () => invalidate(qK.wishlist),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => addToCart(productId, 1),
    onSuccess: () => {
      invalidate(qK.wishlist);
      onClose();
      onCartOpen();
    },
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : 400,
          borderRadius: 0,
          boxShadow: '-8px 0 32px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'DM Sans', fontWeight: 600, color: '#2c2416' }}>
            Wishlist
          </Typography>
          <IconButton onClick={onClose} aria-label="Close wishlist">
            <CloseIcon sx={{ color: '#5c4d3a' }} />
          </IconButton>
        </Box>
        {!isAuthenticated ? (
          <Typography sx={{ color: '#5c4d3a', mt: 2 }}>
            Sign in to view your wishlist.
          </Typography>
        ) : isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Loading…</Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            {items.length === 0 ? (
              <Typography sx={{ color: '#5c4d3a', mt: 2 }}>
                Your wishlist is empty.
              </Typography>
            ) : (
              items.map((item) => (
                <WishlistLine
                  key={item.id}
                  item={item}
                  onAddToCart={() => item.Product && addToCartMutation.mutate(item.productId)}
                  onRemove={() => removeMutation.mutate(item.id)}
                />
              ))
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
