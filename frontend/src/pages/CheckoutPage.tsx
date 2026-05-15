import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getCart, removeFromCart } from '@/api/cart';
import { createOrder } from '@/api/orders';
import { useAuth } from '@/context/AuthContext';
import { getProductImageUrl } from '@/api/products';
import { useUserInvalidate, useUserQuery } from '@/hooks/useQuery';
import { CartItem } from '@/types';
import { qK } from '@/types/query';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { invalidate } = useUserInvalidate();
  const { isAuthenticated } = useAuth();

  const { data: cartItems = [], isLoading }
    = useUserQuery<CartItem[]>(
      qK.cart,
      getCart,
    );

  const createOrderMutation = useMutation({
    mutationFn: ({ total, items }: { total: number; items: any[] }) =>
      createOrder(total, items),
    onSuccess: async () => {
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }
      invalidate(qK.cart);
      setOrderPlaced(true);
    },
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const total = cartItems.reduce((sum, item) => {
    const p = item.Product;
    return sum + (p ? p.discountedPrice * item.quantity : 0);
  }, 0);

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontFamily: 'DM Sans', color: '#5c4d3a', mb: 2 }}>
            Please sign in to checkout.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              fontFamily: 'DM Sans',
              borderColor: '#5c4d3a',
              color: '#5c4d3a',
              '&:hover': { borderColor: '#4a3f32', backgroundColor: 'rgba(92,77,58,0.06)' },
            }}
          >
            Back to Home
          </Button>
        </Box>
      </motion.div>
    );
  }

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 72, color: '#2e7d32', mb: 2 }} />
          <Typography variant="h5" sx={{ fontFamily: 'DM Sans', fontWeight: 600, color: '#2c2416', mb: 1 }}>
            Order placed
          </Typography>
          <Typography sx={{ color: '#5c4d3a', mb: 3 }}>
            Thank you for your order. We will process it shortly.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              fontFamily: 'DM Sans',
              backgroundColor: '#5c4d3a',
              '&:hover': { backgroundColor: '#4a3f32' },
              borderRadius: 2,
              py: 1.25,
              px: 3,
            }}
          >
            Continue Shopping
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/orders')}
            sx={{
              textTransform: 'none',
              fontFamily: 'DM Sans',
              borderColor: '#5c4d3a',
              color: '#5c4d3a',
              '&:hover': { borderColor: '#4a3f32', backgroundColor: 'rgba(92,77,58,0.06)' },
              borderRadius: 2,
              py: 1.25,
              px: 3,
              mt: 2,
            }}
          >
            View Recent Shopping / Orders
          </Button>
        </Box>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Typography color="text.secondary">Loading…</Typography>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontFamily: 'DM Sans', color: '#5c4d3a', mb: 2 }}>
            Your cart is empty.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              fontFamily: 'DM Sans',
              borderColor: '#5c4d3a',
              color: '#5c4d3a',
              '&:hover': { borderColor: '#4a3f32', backgroundColor: 'rgba(92,77,58,0.06)' },
            }}
          >
            Back to shop
          </Button>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <Typography variant="h5" sx={{ fontFamily: 'DM Sans', fontWeight: 600, color: '#2c2416', mb: 3 }}>
        Checkout
      </Typography>
      <Box sx={{ mb: 3 }}>
        {cartItems.map((item) => {
          const p = item.Product;
          if (!p) return null;
          return (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2,
                borderBottom: '1px solid #ebe8e3',
              }}
            >
              <Box
                component="img"
                src={getProductImageUrl(p.imageUrl)}
                alt={p.name}
                sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover', bgcolor: '#f5f2ed' }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: 'DM Sans', color: '#2c2416' }}>{p.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty: {item.quantity} × ₹{p.discountedPrice.toLocaleString()}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 600, color: '#2c2416' }}>
                ₹{(p.discountedPrice * item.quantity).toLocaleString()}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontFamily: 'DM Sans', fontWeight: 600, color: '#2c2416' }}>
          Total
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c2416' }}>
          ₹{total.toLocaleString()}
        </Typography>
      </Box>
      <Button
        fullWidth
        variant="contained"
        disabled={createOrderMutation.isPending}
        onClick={() => {
          const itemsPayload = cartItems
            .filter((item) => item.Product)
            .map((item) => ({
              product_id: item.Product!.id,
              quantity: item.quantity,
              price: item.Product!.discountedPrice,
            }));

          createOrderMutation.mutate({
            total,
            items: itemsPayload,
          });
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
        {createOrderMutation.isPending ? 'Placing order…' : 'Place order'}
      </Button>
      <Button
        fullWidth
        variant="text"
        onClick={() => navigate('/')}
        sx={{
          mt: 1.5,
          textTransform: 'none',
          fontFamily: 'DM Sans',
          color: '#5c4d3a',
        }}
      >
        Back to Shop
      </Button>
    </motion.div>
  );
}
