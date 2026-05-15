import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  IconButton,
  InputAdornment,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

import { useAuth } from '@/context/AuthContext';

export default function AuthModal(
  { open, onClose, defaultTab = 'login' }: any
) {
  const { login, register, error, clearError } = useAuth();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      clearError();
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [open]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      tab === 'login'
        ? await login(email, password)
        : await register(name, email, password);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '28px',
          overflow: 'hidden',
          backdropFilter: 'blur(30px)',
          background: '#fff',
          boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
          position: 'relative',
          margin: { xs: 2, md: 'auto' },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '28px',
            padding: '1.5px',
            background: 'linear-gradient(120deg, #f3d3a2, #c89b6d, #f3d3a2)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
        },
      }}
    >
      {/* MAIN CONTAINER - Switches to column on mobile */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        minHeight={{ xs: 'auto', md: '550px' }}
      >

        {/* LEFT PANEL - Becomes a banner on mobile */}
        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            height: { xs: 'auto', md: 'auto' },
            minHeight: { xs: '160px', md: 'auto' },
            position: 'relative',
            color: '#fff',
            p: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'flex-start' },
            background: `
              linear-gradient(180deg, rgba(50, 35, 20, 0.5), rgba(50, 35, 20, 0.2)),
              url('${isDesktop ? '/jewelry.png' : '/jewelry_landscape.png'}')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRight: { xs: 'none', md: '1px solid rgba(200, 155, 109, 0.2)' },
            borderBottom: { xs: '1px solid rgba(200, 155, 109, 0.2)', md: 'none' },
          }}
        >
          <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'row', md: 'column' }}>
            {/* Diamond Icon */}
            <Box
              component="svg"
              width={{ xs: 30, md: 40 }}
              height={{ xs: 30, md: 40 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              sx={{ color: '#f3d3a2', mb: { xs: 0, md: 4 }, mr: { xs: 2, md: 0 } }}
            >
              <path d="M12 2L2 7l10 12 10-12-10-5z" />
              <path d="M2 7l10 5 10-5" />
              <path d="M12 7v12" />
            </Box>

            <Box>
              {/* Timeless Elegance Title */}
              <Box
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: { xs: 24, md: 44 },
                  lineHeight: 1.1,
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  mb: { xs: 0.5, md: 3 },
                  textAlign: { xs: 'left', md: 'left' }
                }}
              >
                Timeless <br /> Elegance
              </Box>

              {/* Subtitle - Only show on desktop */}
              <Box fontSize={isDesktop ? 15 : 10} sx={{ opacity: 0.9, fontWeight: 300 }}>
                Discover exquisite imitation jewellery crafted for every moment that shines.
              </Box>
            </Box>
          </Box>
        </Box>

        {/* RIGHT PANEL */}
        <Box sx={{ flex: 1, position: 'relative', background: '#fcfcfc' }}>

          {/* CLOSE BUTTON */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              color: '#444',
              transition: 'all 0.2s',
              '&:hover': {
                background: '#f5f5f5',
                transform: 'scale(1.05)',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <DialogTitle sx={{ pb: 0, pt: { xs: 2, md: 4 }, px: 4 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                minHeight: 'auto',
                '& .MuiTabs-flexContainer': {
                  gap: 3,
                },
                '& .MuiTab-root': {
                  textTransform: 'uppercase',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  minWidth: 'auto',
                  padding: '8px 4px',
                  color: '#888',
                  '&.Mui-selected': {
                    color: '#b68b5e',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#b68b5e',
                  height: 2,
                  borderRadius: '2px',
                },
              }}
            >
              <Tab value="login" label="Sign In" />
              <Tab value="register" label="Create Account" />
            </Tabs>
          </DialogTitle>

          <DialogContent sx={{ px: 4, pb: 4, pt: 2 }}>
            <AnimatePresence mode="wait">
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                onSubmit={handleSubmit}
              >

                {/* FIELDS */}
                {tab === 'register' && (
                  <Box sx={{ mb: 2.5, pt: 2 }}>
                    <TextField
                      fullWidth
                      required
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '14px',
                          bgcolor: '#fff',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                          '& fieldset': {
                            borderColor: 'rgba(200,155,109,0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#c89b6d',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#b68b5e',
                            borderWidth: '1.5px',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#aaa',
                          '&.Mui-focused': {
                            color: '#b68b5e',
                          },
                        },
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ mb: 2.5, pt: tab === "register" ? 0 : 2 }}>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        bgcolor: '#fff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        '& fieldset': {
                          borderColor: 'rgba(200,155,109,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#c89b6d',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#b68b5e',
                          borderWidth: '1.5px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#aaa',
                        '&.Mui-focused': {
                          color: '#b68b5e',
                        },
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    required
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((p) => !p)}
                            edge="end"
                            sx={{ color: '#666' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        bgcolor: '#fff',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        '& fieldset': {
                          borderColor: 'rgba(200,155,109,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#c89b6d',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#b68b5e',
                          borderWidth: '1.5px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#aaa',
                        '&.Mui-focused': {
                          color: '#b68b5e',
                        },
                      },
                    }}
                  />
                </Box>

                {/* FORGOT PASSWORD */}
                {tab === 'login' && (
                  <Box textAlign="right" fontSize={13} mb={3} mt={0.5} color="#777" fontWeight={500}>
                    Forgot password?
                  </Box>
                )}

                {error && (
                  <Box
                    sx={{
                      mb: 2,
                      color: '#d32f2f',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </Box>
                )}

                {/* SIGN IN BUTTON */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 600,
                    position: 'relative',
                    overflow: 'hidden',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #8a613a, #c99e74, #8a613a)',
                    backgroundSize: '200% 200%',
                    boxShadow: '0 8px 25px rgba(160, 120, 80, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(160, 120, 80, 0.4)',
                      backgroundPosition: 'right center',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    },
                    ...(loading && {
                      color: 'transparent',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                        animation: 'shimmer 1.5s infinite',
                      },
                    }),
                    '@keyframes shimmer': {
                      '100%': { transform: 'translateX(100%)' },
                    },
                  }}
                >
                  {tab === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                {/* DIVIDER */}
                <Divider sx={{ my: 3, color: '#999', fontSize: 13 }}>
                  or continue with
                </Divider>

                {/* SOCIAL BUTTONS */}
                <Box display="flex" gap={2}>
                  <Button
                    fullWidth
                    startIcon={<GoogleIcon />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.2,
                      bgcolor: '#fff',
                      color: '#333',
                      border: '1px solid rgba(200,155,109,0.25)',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                      '&:hover': {
                        bgcolor: '#fafafa',
                        borderColor: '#c89b6d',
                      },
                    }}
                  >
                    Google
                  </Button>

                  <Button
                    fullWidth
                    startIcon={<AppleIcon />}
                    sx={{
                      borderRadius: '12px',
                      py: 1.2,
                      bgcolor: '#fff',
                      color: '#333',
                      border: '1px solid rgba(200,155,109,0.25)',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                      '&:hover': {
                        bgcolor: '#fafafa',
                        borderColor: '#c89b6d',
                      },
                    }}
                  >
                    Apple
                  </Button>
                </Box>

                {tab === "login" &&
                  <Box textAlign="center" mt={3} fontSize={14} color="#666">
                    Don’t have an account?{' '}
                    <Box
                      component="span"
                      onClick={() => setTab('register')}
                      sx={{
                        color: '#c89b6d',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Create account
                    </Box>
                  </Box>
                }
              </motion.form>
            </AnimatePresence>
          </DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
}