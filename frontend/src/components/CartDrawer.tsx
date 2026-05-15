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
import { getCart, removeFromCart } from '@/api/cart';
import { useAuth } from '@/context/AuthContext';
import type { CartItem } from '@/types';
import { getProductImageUrl } from '@/api/products';
import { useUserInvalidate, useUserQuery } from '@/hooks/useQuery';
import { qK } from '@/types/query';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

function CartLine({ item }: { item: CartItem }) {
  const { invalidate } = useUserInvalidate();

  const remove = useMutation({
    mutationFn: () => removeFromCart(item.id),
    onSuccess: () => invalidate(qK.cart),
  });

  const product = item.Product;
  if (!product) return null;
  const subtotal = product.discountedPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-4 border-b border-[#ebe8e3] last:border-0"
    >
      <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#f5f2ed] flex-shrink-0">
        <img
          src={getProductImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[#2c2416] font-medium truncate">{product.name}</p>
        <p className="text-sm text-[#5c4d3a] mt-0.5">Qty: {item.quantity}</p>
        <p className="text-[#2c2416] font-medium mt-1">₹{subtotal.toLocaleString()}</p>
      </div>
      <IconButton
        size="small"
        onClick={() => remove.mutate()}
        disabled={remove.isPending}
        sx={{ color: '#8a7a65', '&:hover': { color: '#c62828' } }}
        aria-label="Remove"
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </motion.div>
  );
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const { data: items = [], isLoading } = useUserQuery<CartItem[]>(
    qK.cart,
    getCart,
    { enabled: open }
  );

  const total = items.reduce((sum, item) => {
    const p = item.Product;
    return sum + (p ? p.discountedPrice * item.quantity : 0);
  }, 0);

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
            Your Cart
          </Typography>
          <IconButton onClick={onClose} aria-label="Close cart">
            <CloseIcon sx={{ color: '#5c4d3a' }} />
          </IconButton>
        </Box>
        {!isAuthenticated ? (
          <Typography sx={{ color: '#5c4d3a', mt: 2 }}>
            Sign in to view and manage your cart.
          </Typography>
        ) : isLoading ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Loading…</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              {items.length === 0 ? (
                <Typography sx={{ color: '#5c4d3a', mt: 2 }}>
                  Your cart is empty.
                </Typography>
              ) : (
                items.map((item) => <CartLine key={item.id} item={item} />)
              )}
            </Box>
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4 border-t border-[#ebe8e3]"
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontFamily: 'DM Sans', fontWeight: 600, color: '#2c2416' }}>
                    Subtotal
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#2c2416' }}>
                    ₹{total.toLocaleString()}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontFamily: 'DM Sans',
                    backgroundColor: '#5c4d3a',
                    '&:hover': { backgroundColor: '#4a3f32' },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </motion.div>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
}
