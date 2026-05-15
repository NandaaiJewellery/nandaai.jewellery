import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Toolbar,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
  Box,
  Menu,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ShoppingCart as OrdersIcon } from '@mui/icons-material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'sonner'; // ✅ Import toast
import { SortOption } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getProductCategories } from '@/api/products';
import { useNavigate, useLocation } from 'react-router-dom';
import { qK } from '@/types/query';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price_asc', label: 'Price Low to High' },
  { value: 'price_desc', label: 'Price High to Low' },
  { value: 'new_arrivals', label: 'New Arrivals' },
];

interface NavbarProps {
  category: string;
  sort: SortOption;
  search: string;
  onCategoryChange: (v: string) => void;
  onSortChange: (v: SortOption) => void;
  onSearchChange: (v: string) => void;
  onWishlistOpen: () => void;
  onCartOpen: () => void;
  onProfileClick: () => void;
  cartCount?: number;
  wishlistCount?: number;
}

export default function Navbar({
  category,
  sort,
  search,
  onCategoryChange,
  onSortChange,
  onSearchChange,
  onWishlistOpen,
  onCartOpen,
  onProfileClick,
  cartCount = 0,
  wishlistCount = 0,
}: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const isHome = location.pathname === '/';
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: productCategories = [] } = useQuery({
    queryKey: qK.productCatalogue(),
    queryFn: getProductCategories,
  });

  const handleProtectedAction = (action: () => void, itemName: string) => {
    if (isAuthenticated) {
      action();
    } else {
      toast.error(`Please Login to access your ${itemName}`);
      onProfileClick(); // Opens AuthModal
    }
  };

  const userLogout = () => {
    logout();
    setProfileAnchor(null);
    if (!isHome) navigate("/");
  };

  const handleProfileClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isAuthenticated) setProfileAnchor(e.currentTarget);
    else onProfileClick();
  };

  const navButtonStyle = (active: boolean) => ({
    py: 0.5,
    px: 1.25,
    borderRadius: 2,
    fontSize: '0.8rem',
    fontFamily: 'DM Sans',
    color: active ? '#b8860b' : '#5c4d3a',
    fontWeight: active ? 600 : 500,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileOpen]);

  return (
    <motion.div
      initial={{ x: '-50%', y: -20, opacity: 0 }}
      animate={{ x: '-50%', y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl"
    >
      <Box
        sx={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          border: '1px solid rgba(255,255,255,0.8)',
          overflow: 'visible',
          position: 'relative'
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 1.5, md: 2 },
            py: 0.5,
            minHeight: { xs: 56, md: 64 },
            justifyContent: 'space-between',
          }}
        >
          {isMobile ? (
            <>
              <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
                <MenuIcon sx={{ color: '#5c4d3a' }} />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton onClick={() => handleProtectedAction(onWishlistOpen, "Wishlist")}>
                  <Badge
                    badgeContent={wishlistCount}
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#ec4899', color: "white" } }}
                  >
                    <FavoriteBorderIcon sx={{ color: '#5c4d3a' }} />
                  </Badge>
                </IconButton>

                <IconButton onClick={() => handleProtectedAction(onCartOpen, "Cart")}>
                  <Badge
                    badgeContent={cartCount}
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#b8860b', color: "white" } }}
                  >
                    <ShoppingBagOutlinedIcon sx={{ color: '#5c4d3a' }} />
                  </Badge>
                </IconButton>

                <IconButton onClick={handleProfileClick}>
                  <PersonOutlineIcon sx={{ color: '#5c4d3a' }} />
                </IconButton>
              </Box>
            </>
          ) : (
            <>
              {isHome ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <Box
                      component="button"
                      onClick={() => onCategoryChange('')}
                      sx={navButtonStyle(category === '')}
                    >
                      All
                    </Box>

                    {productCategories.map((cat: { id: number; name: string }) => (
                      <Box
                        key={cat.id}
                        component="button"
                        onClick={() => onCategoryChange(String(cat.id))}
                        sx={navButtonStyle(category === String(cat.id))}
                      >
                        {cat.name}
                      </Box>
                    ))}
                  </Box>

                  <FormControl size="small" sx={{ minWidth: 140, mx: 1 }}>
                    <Select
                      value={sort}
                      onChange={(e) => onSortChange(e.target.value as SortOption)}
                      sx={{ borderRadius: 3 }}
                    >
                      {SORT_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#8a7a65' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 200 }}
                  />
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Box
                      component="button"
                      onClick={() => handleProtectedAction(onWishlistOpen, "Wishlist")}
                      sx={navButtonStyle(false)}
                    >
                      Wishlist
                    </Box>

                    <Box
                      component="button"
                      onClick={() => handleProtectedAction(onCartOpen, "Cart")}
                      sx={navButtonStyle(false)}
                    >
                      Cart
                    </Box>

                    <Box
                      component="button"
                      onClick={() => handleProtectedAction(() => navigate('/orders'), "Orders")}
                      sx={navButtonStyle(location.pathname === '/orders')}
                    >
                      Orders
                    </Box>
                  </Box>
                </>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton onClick={() => handleProtectedAction(onWishlistOpen, "Wishlist")}>
                  <Badge
                    badgeContent={wishlistCount}
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#ec4899', color: "white" } }}
                  >
                    <FavoriteBorderIcon sx={{ color: '#5c4d3a' }} />
                  </Badge>
                </IconButton>

                <IconButton onClick={() => handleProtectedAction(onCartOpen, "Cart")}>
                  <Badge
                    badgeContent={cartCount}
                    sx={{ '& .MuiBadge-badge': { backgroundColor: '#b8860b', color: "white" } }}
                  >
                    <ShoppingBagOutlinedIcon sx={{ color: '#5c4d3a' }} />
                  </Badge>
                </IconButton>

                <IconButton onClick={handleProfileClick}>
                  <PersonOutlineIcon sx={{ color: '#5c4d3a' }} />
                </IconButton>
              </Box>
            </>
          )}

          <Menu
            anchorEl={profileAnchor}
            open={!!profileAnchor}
            onClose={() => setProfileAnchor(null)}
          >
            {user && <MenuItem disabled>{user.name}</MenuItem>}

            <MenuItem
              onClick={() => {
                navigate('/orders');
                setProfileAnchor(null);
              }}
            >
              <OrdersIcon sx={{ mr: 1 }} />
              Orders
            </MenuItem>

            <MenuItem onClick={userLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Log out
            </MenuItem>
          </Menu>
        </Toolbar>
      </Box>

      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed left-4 right-4 top-[72px] z-40 rounded-2xl overflow-hidden shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
            }}
          >
            <Box sx={{ py: 2, px: 2 }}>
              {isHome ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <Select
                      value={category || ''}
                      onChange={(e) => {
                        onCategoryChange(e.target.value);
                        setMobileOpen(false);
                      }}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) return 'All';
                        const selectedCategory = productCategories.find(
                          (cat: { id: number; name: string }) =>
                            String(cat.id) === selected
                        );
                        return selectedCategory ? selectedCategory.name : 'All';
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {productCategories.map((cat: { id: number; name: string }) => (
                        <MenuItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <Select
                      value={sort}
                      onChange={(e) => {
                        onSortChange(e.target.value as SortOption);
                        setMobileOpen(false);
                      }}
                    >
                      {SORT_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <Box
                    component="button"
                    onClick={() => {
                      handleProtectedAction(onCartOpen, "Cart");
                      setMobileOpen(false);
                    }}
                    sx={{ ...navButtonStyle(false), width: '100%', textAlign: 'left', mb: 2 }}
                  >
                    Cart
                  </Box>

                  <Box
                    component="button"
                    onClick={() => {
                      handleProtectedAction(onWishlistOpen, "Wishlist");
                      setMobileOpen(false);
                    }}
                    sx={{ ...navButtonStyle(false), width: '100%', textAlign: 'left', mb: 2 }}
                  >
                    Wishlist
                  </Box>

                  {isAuthenticated &&
                    <Box
                      component="button"
                      onClick={() => {
                        handleProtectedAction(() => navigate('/orders'), "Orders");
                        setMobileOpen(false);
                      }}
                      sx={{ ...navButtonStyle(location.pathname === '/orders'), width: '100%', textAlign: 'left', mb: 2 }}
                    >
                      Orders
                    </Box>
                  }

                  <Box
                    component="button"
                    onClick={() => {
                      navigate('/');
                      setMobileOpen(false);
                    }}
                    sx={{ ...navButtonStyle(false), width: '100%', textAlign: 'left' }}
                  >
                    Home
                  </Box>
                </>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}