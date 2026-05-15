import { Box, Typography, IconButton } from "@mui/material";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "@/styles/Footer.css"
import { useAuth } from "@/context/AuthContext";

interface FooterProps {
    onAuthOpen: () => void;
    onCartOpen: () => void;
    onWishlistOpen: () => void;
}

export default function Footer({
    onAuthOpen,
    onCartOpen,
    onWishlistOpen
}: FooterProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleProtectedAction = (action: () => void, message: string) => {
        if (isAuthenticated) {
            action();
        } else {
            toast.warning(`Please Login to ${message}`);
            onAuthOpen();
        }
    };

    const location = useLocation();

    const handleShopClick = () => {
        if (location.pathname === '/') {
            const section = document.getElementById('products');
            if (section)
                section.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/#products');
        }
    };

    return (
        <Box
            component="footer"
            sx={{
                mt: 10,
                background: "linear-gradient(135deg, #f8f5f0 0%, #efe9df 100%)",
                borderTop: "1px solid #e6dfd3",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-6 py-14 
                grid grid-cols-1 
                md:grid-cols-[2fr_1.5fr_1fr_1fr] 
                gap-12"
            >
                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "DM Sans",
                            fontWeight: 700,
                            color: "#2c2416",
                            mb: 2,
                            letterSpacing: 1,
                        }}
                    >
                        NANDAAI <br />IMITATION JEWELLERY
                    </Typography>
                    <Typography className="text-justify" sx={{ color: "#5c4d3a", lineHeight: 1.8 }}>
                        Timeless elegance crafted for modern women. Discover modern and subtle
                        imitation jewellery that celebrates beauty, grace, and everyday
                        luxury.
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            fontFamily: "DM Sans",
                            color: "#2c2416",
                        }}
                    >
                        Contact Us
                    </Typography>

                    <Typography sx={{ mb: 1, color: "#5c4d3a" }}>
                        <strong>Name:</strong> Nandaai Imitation Jewellery
                    </Typography>
                    <Typography sx={{ mb: 1, color: "#5c4d3a" }}>
                        <strong style={{ marginRight: 3 }}>Address:</strong>
                        BhaktiSindhu, Plot No. 24, Siddhivinayaka Nagar,
                        Faizpur Dist. Jalgaon
                    </Typography>
                    <Typography sx={{ mb: 1, color: "#5c4d3a" }}>
                        <strong style={{ marginRight: 3 }}>Contact Number:</strong>
                        <a href="tel:+919403310702" style={{ color: "#5c4d3a", textDecoration: "none" }}>
                            +91 9403310702
                        </a>
                    </Typography>
                    <Typography sx={{ mb: 1, color: "#5c4d3a" }}>
                        <strong style={{ marginRight: 3 }}>Email:</strong>
                        <a href="mailto:support@nandaai.com" style={{ color: "#5c4d3a", textDecoration: "none" }}>
                            support@nandaai.com
                        </a>
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            fontFamily: "DM Sans",
                            color: "#2c2416",
                        }}
                    >
                        Quick Links
                    </Typography>

                    <div className="flex flex-col space-y-2">
                        <a href="/" className="footer-link cursor-pointer">Home</a>
                        <span className="footer-link cursor-pointer" onClick={handleShopClick}>Shop</span>

                        <span
                            className="footer-link cursor-pointer"
                            onClick={() =>
                                handleProtectedAction(
                                    onCartOpen,
                                    "grab your AWESOME choices from CART"
                                )
                            }
                        >
                            Cart
                        </span>

                        <span
                            className="footer-link cursor-pointer"
                            onClick={() =>
                                handleProtectedAction(
                                    onWishlistOpen,
                                    "save your AWESOME choices to WISHLIST"
                                )
                            }
                        >
                            Wishlist
                        </span>

                        <span
                            className="footer-link cursor-pointer"
                            onClick={() =>
                                handleProtectedAction(
                                    () => navigate("/orders"), "review your AWESOME recent ORDERS"
                                )
                            }
                        >
                            My Orders
                        </span>
                    </div>
                </Box>

                <Box>
                    <Typography
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            fontFamily: "DM Sans",
                            color: "#2c2416",
                        }}
                    >
                        Customer Care
                    </Typography>

                    <div className="flex flex-col space-y-2 text-[#463724]">
                        <span
                            title="Coming Soon"
                            className="cursor-pointer hover:underline hover:text-slate-600">
                            Shipping & Delivery
                        </span>
                        <span
                            title="Coming Soon"
                            className="cursor-pointer hover:underline hover:text-slate-600">
                            Returns & Exchange
                        </span>
                        <span
                            title="We value your privacy and ensure your data is protected."
                            className="cursor-pointer hover:underline hover:text-slate-600">
                            Privacy Policy
                        </span>
                        <span
                            title="Read our terms and conditions to understand your rights and obligations."
                            className="cursor-pointer hover:underline hover:text-slate-600">
                            Terms & Conditions
                        </span>
                    </div>
                </Box>
            </motion.div >

            <Box
                sx={{
                    borderTop: "1px solid #e0d8cc",
                    py: 3,
                    px: 4,
                }}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <Typography sx={{ color: "#5c4d3a" }}>
                        © {new Date().getFullYear()} Nandaai Imitation Jewellery. All rights reserved.
                    </Typography>

                    <div className="flex space-x-3">
                        <IconButton
                            component="a"
                            href="https://www.facebook.com/minakshi.badhe.73"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            sx={{ color: "#5c4d3a" }}
                        >
                            <Facebook />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="https://www.instagram.com/minakshibadhe"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            sx={{ color: "#5c4d3a" }}
                        >
                            <Instagram />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="https://wa.me/9403310702?text=Hello%2C%0AI%20am%20interested%20in%20one%20or%20more%20items%20on%20your%20website%20and%20would%20like%20to%20inquire%20about%20the%20pricing%20and%20delivery%20options.%0AI%20would%20appreciate%20any%20details%20you%20can%20provide.%0AThank%20you."
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            sx={{ color: "#5c4d3a" }}
                        >
                            <WhatsApp />
                        </IconButton>
                    </div>
                </div>
            </Box>
        </Box >
    );
}