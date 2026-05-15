import { useParams, Link, useOutletContext } from 'react-router-dom'; // Added useOutletContext
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Button,
    IconButton,
    Divider,
    Rating,
    Avatar
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { toast } from 'sonner'; // Import toast
import { getProductById, fetchProducts, getProductImageUrl } from '@/api/products';
import { addToCart } from '@/api/cart';
import { getWishlist, addToWishlist, removeFromWishlist } from '@/api/wishlist';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import "@/styles/ProductPage.css";
import API_BASE from '@/api/client';

import { motion, animate } from "framer-motion";
import { useState, useEffect } from "react";
import { useUserInvalidate, useUserQuery } from '@/hooks/useQuery';
import { WishlistItem } from '@/types';
import { qK } from '@/types/query';

export function AnimatedPrice({ originalPrice, discountedPrice }:
    {
        originalPrice: number,
        discountedPrice?: number
    }) {
    const [displayPrice, setDisplayPrice] = useState(originalPrice);

    useEffect(() => {
        if (!discountedPrice || discountedPrice >= originalPrice) {
            setDisplayPrice(originalPrice);
            return;
        }

        const controls = animate(originalPrice, discountedPrice, {
            duration: 1.2,
            onUpdate(value) {
                setDisplayPrice(Math.round(value));
            },
            ease: "easeOut",
        });

        return () => controls.stop();
    }, [originalPrice, discountedPrice]);

    const savings = discountedPrice ? originalPrice - discountedPrice : 0;
    const percentOff = discountedPrice ? Math.round((savings / originalPrice) * 100) : 0;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                {discountedPrice && discountedPrice < originalPrice ? (
                    <motion.p
                        key={discountedPrice}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-3xl font-semibold text-[#2c2416]"
                    >
                        ₹{displayPrice.toLocaleString()}
                    </motion.p>
                ) : (
                    <p className="text-3xl font-semibold text-[#2c2416]">
                        ₹{originalPrice.toLocaleString()}
                    </p>
                )}

                {discountedPrice && discountedPrice < originalPrice && (
                    <p className="text-lg text-[#8c7a62] line-through">
                        ₹{originalPrice.toLocaleString()}
                    </p>
                )}

                {discountedPrice && discountedPrice < originalPrice && (
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium"
                    >
                        {percentOff}% OFF
                    </motion.span>
                )}
            </div>

            {savings > 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-emerald-700 font-medium"
                >
                    You Save ₹{savings.toLocaleString()}
                </motion.p>
            )}
        </div>
    );
}

export default function ProductPage() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth(); // Get auth state
    const { onAuthOpen } = useOutletContext<{ onAuthOpen: () => void }>(); // Get onAuthOpen from Layout
    const { invalidate } = useUserInvalidate();

    if (!id) return null;

    const { data: product } = useQuery({
        queryKey: qK.product(id),
        queryFn: () => getProductById(id),
        enabled: !!id,
    });

    const { data: reviews = [] } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            // Replace with getReviewsByProductId(id)
            return [
                {
                    id: 1,
                    name: "Ananya Sharma",
                    rating: 5,
                    comment: "Absolutely stunning craftsmanship. Looks even better in person.",
                    date: "2 weeks ago"
                },
                {
                    id: 2,
                    name: "Ritika Mehta",
                    rating: 4,
                    comment: "Elegant and minimal. Perfect for special occasions.",
                    date: "1 month ago"
                }
            ];
        }
    });

    const { data: relatedProducts = [] } = useQuery({
        queryKey: ['relatedProducts', id],
        queryFn: async () => {
            // Replace with getRelatedProducts(product.category_id)
            const products = await fetchProducts();
            return products.filter(p => p.id !== id).slice(0, 6);
        }
    });

    const addCartMutation = useMutation({
        mutationFn: () => addToCart(product!.id, 1),
        onSuccess: () => invalidate(qK.cart),
    });

    const { data: wishlistItems = [] } =
        useUserQuery<WishlistItem[]>(
            qK.wishlist,
            getWishlist,
        );

    const wishlistEntry = wishlistItems.find(
        (w) => w.productId === product?.id
    );

    const isInWishlist = !!wishlistEntry;

    const addWishlistMutation = useMutation({
        mutationFn: () => addToWishlist(product!.id),
        onSuccess: () =>
            invalidate(qK.wishlist),
    });

    const removeWishlistMutation = useMutation({
        mutationFn: () => removeFromWishlist(wishlistEntry!.id),
        onSuccess: () =>
            invalidate(qK.wishlist),
    });

    // Helper for protected actions
    const handleProtectedAction = (action: () => void, itemName: string) => {
        if (isAuthenticated) {
            action();
        } else {
            toast.warning(`Please Login to put your AWESOME choice into ${itemName.toUpperCase()}`);
            onAuthOpen();
        }
    };

    // Handle Enquire with auth
    const handleEnquire = () => {
        if (!isAuthenticated) {
            toast.error("Please Login to enquire about this product");
            onAuthOpen();
            return;
        }
        // If authenticated, open WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            `Hello, I'm interested in ${product!.name} - ₹${product!.originalPrice}`
        )}`;
        window.open(whatsappUrl, '_blank');
    };

    if (!product) return null;

    return (
        <div className="bg-[#f6f2ec] min-h-screen">
            <meta property="og:title" content={product.name} />
            <meta property="og:description" content={product.popularityScore.toLocaleString()} />
            <meta property="og:image" content={getProductImageUrl(product.imageUrl)} />
            <meta property="og:url" content={`${API_BASE}/product/${product.id}`} />

            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 text-sm text-[#8c7a62] flex items-center"
            >
                <Link to="/" className="hover:text-amber-800 transition-colors">Home</Link>
                <ChevronRightIcon fontSize="small" />
                <span className="text-[#2c2416]">{product.name}</span>
            </motion.nav>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-14">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-3xl overflow-hidden bg-[#f7ecdb]"
                    >
                        <img
                            src={getProductImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <div>
                        <div className="flex items-start justify-between">
                            <h1 className="font-serif text-4xl text-[#2c2416]">
                                {product.name}
                            </h1>

                            <motion.div
                                whileTap={{ scale: 0.85 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                <IconButton
                                    onClick={() =>
                                        handleProtectedAction(
                                            () => isInWishlist
                                                ? removeWishlistMutation.mutate()
                                                : addWishlistMutation.mutate(),
                                            isInWishlist ? "Wishlist" : "Wishlist"
                                        )
                                    }
                                    sx={{
                                        border: '1px solid rgba(92,77,58,0.3)',
                                        color: isInWishlist ? '#c62828' : '#5c4d3a'
                                    }}
                                >
                                    {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </motion.div>
                        </div>

                        <AnimatedPrice
                            originalPrice={product.originalPrice}
                            discountedPrice={product.discountedPrice}
                        />

                        <Divider className="my-6" />

                        <p className="text-[#5c4d3a] leading-relaxed">
                            Crafted with timeless artistry and modern refinement.
                        </p>

                        <div className="mt-8 flex gap-4">

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleProtectedAction(() => addCartMutation.mutate(), "Cart")}
                                className="gold-btn"
                                startIcon={<AddShoppingCartOutlinedIcon />}
                            >
                                Add to Cart
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleEnquire}
                                startIcon={<WhatsAppIcon />}
                                sx={{
                                    borderColor: '#25D366',
                                    color: '#25D366',
                                    textTransform: 'none'
                                }}
                            >
                                Enquire
                            </Button>

                        </div>

                    </div>
                </div>

                <section className="mt-24">
                    <h2 className="font-serif text-3xl text-[#2c2416] mb-8">
                        Customer Reviews
                    </h2>

                    <div className="space-y-8">
                        {reviews.map((review: any) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-2xl shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar>{review.name[0]}</Avatar>
                                    <div>
                                        <p className="font-medium text-[#2c2416]">{review.name}</p>
                                        <Rating value={review.rating} readOnly size="small" />
                                    </div>
                                </div>
                                <p className="mt-4 text-[#5c4d3a]">{review.comment}</p>
                                <p className="mt-2 text-xs text-[#8c7a62]">{review.date}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="mt-24">
                    <h2 className="font-serif text-3xl text-[#2c2416] mb-8">
                        You May Also Like
                    </h2>

                    <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                        {relatedProducts.map((item: any) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -4 }}
                                className="min-w-[220px] snap-start bg-white rounded-2xl shadow-sm overflow-hidden"
                            >
                                <Link to={`/product/${item.id}`}>
                                    <img
                                        src={getProductImageUrl(item.imageUrl)}
                                        className="h-64 w-full object-cover"
                                    />
                                    <div className="p-4">
                                        <p className="text-sm text-[#8c7a62]">{item.name}</p>
                                        <p className="font-medium text-[#2c2416]">
                                            ₹{item.originalPrice.toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}