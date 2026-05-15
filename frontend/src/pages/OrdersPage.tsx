import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { getCustomerOrders } from "@/api/orders";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getProductImageUrl } from "@/api/products";
import { useUserQuery } from "@/hooks/useQuery";
import { qK } from "@/types/query";
import { Order } from "@/types";

export default function Orders() {
    const navigate = useNavigate();

    const { data: customerOrders = [], isLoading } =
        useUserQuery<Order[]>(
            qK.orders,
            getCustomerOrders,
        );

    if (!customerOrders) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 lg:px-8 lg:pl-16 pt-4 text-sm text-[#8c7a62] flex items-center"
            >
                <Link to="/" className="hover:text-amber-800 transition-colors">Home</Link>
                <ChevronRightIcon fontSize="small" />
                <span className="text-[#2c2416]">Orders</span>
            </motion.nav>
            <div className="max-w-5xl mx-auto mt-2 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Orders</h1>

                    <Button
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{
                            textTransform: 'none',
                            fontFamily: 'DM Sans',
                            color: '#5c4d3a',
                        }}
                    >
                        Back to Shop
                    </Button>
                </div>
                <div className="space-y-6">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="border rounded-xl p-5 shadow-sm bg-white"
                            >
                                {/* Header */}
                                <div className="flex justify-between mb-3">
                                    <Skeleton width={120} height={20} />
                                    <Skeleton width={100} height={20} />
                                </div>

                                {/* Status */}
                                <Skeleton width={140} height={20} className="mb-3" />

                                {/* Items */}
                                <div className="space-y-3">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 border p-3 rounded-lg"
                                        >
                                            <Skeleton variant="rectangular" width={80} height={80} />

                                            <div className="flex-1">
                                                <Skeleton width="60%" height={20} />
                                                <Skeleton width="40%" height={18} />
                                            </div>

                                            <Skeleton width={60} height={20} />
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="text-right mt-4">
                                    <Skeleton width={100} height={25} sx={{ ml: "auto" }} />
                                </div>
                            </div>
                        ))
                    ) : (
                        customerOrders.map((order) => (
                            <div
                                key={order.id}
                                className="border rounded-xl p-5 shadow-sm bg-white"
                            >
                                <div className="flex justify-between mb-3">
                                    <div>
                                        <span className="font-semibold">Order ID:</span> {order.id}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span className="text-green-600">{order.status}</span>
                                </div>

                                <div className="space-y-3">
                                    {order.OrderItems.length === 0 ? (
                                        <div className="text-gray-500 text-sm">
                                            No items in this order.
                                        </div>
                                    ) : (
                                        order.OrderItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 border p-3 rounded-lg"
                                            >
                                                <img
                                                    src={getProductImageUrl(item.Product.imageUrl)}
                                                    alt={item.Product.name}
                                                    className="w-20 h-20 object-cover rounded cursor-pointer"
                                                    onClick={() => navigate(`/product/${item.productId}`)}
                                                />

                                                <div className="flex-1">
                                                    <div
                                                        onClick={() => navigate(`/product/${item.productId}`)} className="font-medium w-min lg:text-nowrap md:text-wrap cursor-pointer">
                                                        {item.Product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Qty: {item.quantity}
                                                    </div>
                                                </div>

                                                <div className="font-semibold">
                                                    ₹{item.price}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="text-right mt-4 font-bold">
                                    Total: ₹{order.totalAmount}
                                </div>
                            </div>


                        ))
                    )}
                </div>
            </div>
        </motion.div >
    );
}
