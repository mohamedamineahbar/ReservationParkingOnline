import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Header = () => {
    const { reservationInfo } = useReservation();
    const { user } = useContext(AuthContext);
    const [timeLeft, setTimeLeft] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    /* Scroll-aware shadow */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navigate = useNavigate();

    /* Nav links: public links always visible, auth-aware ones conditional */
    const publicLinks = [
        { label: 'Home',        to: '/' },
        { label: 'Parking Lots', to: '/parking-lots' },
        { label: 'About Us',    to: '/', scrollToId: 'about-section' },
        { label: 'Contact',     to: '/', scrollToId: 'contact-section' },
        ...(user ? [{ label: 'My Profile', to: '/my-profile' }] : []),
    ];

    const handleScrollToSection = (sectionId) => (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
        setMobileOpen(false);
    };

    const handleDrawerToggle = () => setMobileOpen(prev => !prev);

    useEffect(() => {
        if (!reservationInfo?.validUntil || reservationInfo?.checkedIn) {
            setTimeLeft('');
            return;
        }
        const interval = setInterval(() => {
            const now = new Date();
            const expiry = new Date(reservationInfo.validUntil);
            const diff = Math.max(0, Math.floor((expiry - now) / 1000));
            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            setTimeLeft(`${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, [reservationInfo]);

    const isActive = (to) => location.pathname === to;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Syne:wght@700;800&display=swap');

                .hdr-nav-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 0.855rem !important;
                    text-transform: none !important;
                    border-radius: 8px !important;
                    padding: 6px 14px !important;
                    color: rgba(255,255,255,0.88) !important;
                    letter-spacing: 0 !important;
                    min-width: 0 !important;
                    transition: background 0.18s, color 0.18s !important;
                    position: relative;
                }
                .hdr-nav-btn:hover {
                    background: rgba(255,255,255,0.12) !important;
                    color: #fff !important;
                }
                .hdr-nav-btn.active {
                    background: rgba(255,255,255,0.16) !important;
                    color: #fff !important;
                }
                .hdr-nav-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: 2px; left: 50%;
                    transform: translateX(-50%);
                    width: 18px; height: 2px;
                    border-radius: 2px;
                    background: #fff;
                }

                .hdr-login-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 0.855rem !important;
                    text-transform: none !important;
                    border-radius: 8px !important;
                    padding: 6px 16px !important;
                    color: #fff !important;
                    border: 1.5px solid rgba(255,255,255,0.35) !important;
                    letter-spacing: 0 !important;
                    min-width: 0 !important;
                    transition: background 0.18s, border-color 0.18s !important;
                }
                .hdr-login-btn:hover {
                    background: rgba(255,255,255,0.1) !important;
                    border-color: rgba(255,255,255,0.6) !important;
                }

                .hdr-register-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    font-weight: 700 !important;
                    font-size: 0.855rem !important;
                    text-transform: none !important;
                    border-radius: 8px !important;
                    padding: 7px 18px !important;
                    background: #fff !important;
                    color: #1a4db3 !important;
                    letter-spacing: 0 !important;
                    min-width: 0 !important;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.12) !important;
                    transition: background 0.18s, transform 0.15s, box-shadow 0.18s !important;
                }
                .hdr-register-btn:hover {
                    background: #e8f0fe !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.16) !important;
                }

                .hdr-checkin-btn {
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    font-weight: 700 !important;
                    font-size: 0.855rem !important;
                    text-transform: none !important;
                    border-radius: 8px !important;
                    padding: 7px 18px !important;
                    background: linear-gradient(135deg,#10b981,#059669) !important;
                    color: #fff !important;
                    letter-spacing: 0 !important;
                    min-width: 0 !important;
                    box-shadow: 0 4px 16px rgba(16,185,129,0.28) !important;
                    transition: transform 0.15s, box-shadow 0.18s !important;
                }
                .hdr-checkin-btn:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 8px 24px rgba(16,185,129,0.38) !important;
                }

                /* Mobile drawer */
                .hdr-drawer-link {
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 0.95rem !important;
                    padding: 13px 20px !important;
                    color: #0f2d6b !important;
                    border-left: 3px solid transparent !important;
                    transition: background 0.15s, border-color 0.15s !important;
                }
                .hdr-drawer-link:hover, .hdr-drawer-link.active {
                    background: #f0f5ff !important;
                    border-left-color: #2d6ef5 !important;
                    color: #2d6ef5 !important;
                }
            `}</style>

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'transparent',
                    backgroundImage: 'linear-gradient(100deg, #0f2d6b 0%, #1a4db3 55%, #2d6ef5 100%)',
                    borderBottom: scrolled
                        ? '1px solid rgba(255,255,255,0.1)'
                        : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: scrolled
                        ? '0 4px 32px rgba(15,45,107,0.3)'
                        : 'none',
                    transition: 'box-shadow 0.3s, border-color 0.3s',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: { xs: 1.5, sm: 2.5, md: 4 },
                        minHeight: { xs: 64, md: 72 },
                        gap: 1,
                    }}
                >
                    {/* ── Logo ── */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 1.25,
                            textDecoration: 'none', flexShrink: 0,
                        }}
                    >
                        <Box sx={{
                            width: 40, height: 40,
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.15)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            display: 'grid', placeItems: 'center',
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 800, fontSize: '1.15rem', color: '#fff',
                        }}>P</Box>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography sx={{
                                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                                color: '#fff', fontSize: '1.05rem', lineHeight: 1,
                                letterSpacing: '-0.01em',
                            }}>
                                eParking
                            </Typography>
                            <Typography sx={{
                                color: 'rgba(255,255,255,0.55)',
                                fontSize: '0.68rem', letterSpacing: '0.08em',
                                textTransform: 'uppercase', lineHeight: 1,
                                mt: '3px',
                            }}>
                                Bitola
                            </Typography>
                        </Box>
                    </Box>

                    {/* ── Desktop nav links (center) ── */}
                    <Box sx={{
                        display: { xs: 'none', lg: 'flex' },
                        alignItems: 'center',
                        gap: 0.25,
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                        {publicLinks.map(link =>
                            link.scrollToId ? (
                                <Button
                                    key={link.label}
                                    onClick={handleScrollToSection(link.scrollToId)}
                                    className="hdr-nav-btn"
                                >
                                    {link.label}
                                </Button>
                            ) : (
                                <Button
                                    key={link.label}
                                    component={Link}
                                    to={link.to}
                                    className={`hdr-nav-btn${isActive(link.to) ? ' active' : ''}`}
                                >
                                    {link.label}
                                </Button>
                            )
                        )}
                    </Box>

                    {/* ── Right side actions ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>

                        {/* Reservation timer */}
                        {reservationInfo?.validUntil && !reservationInfo?.checkedIn && timeLeft && (
                            <Box sx={{
                                display: { xs: 'none', md: 'inline-flex' },
                                alignItems: 'center', gap: 0.6,
                                px: 1.8, py: 0.7,
                                borderRadius: '8px',
                                bgcolor: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.18)',
                            }}>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#facc15' }}>
                                    ⏳ {timeLeft}
                                </Typography>
                            </Box>
                        )}

                        {/* Check-In — desktop only */}
                        <Button
                            component={Link}
                            to="/checkin"
                            className="hdr-checkin-btn"
                            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                        >
                            Check-In
                        </Button>

                        {/* Auth buttons — desktop only, shown when NOT logged in */}
                        {!user && (
                            <>
                                <Button
                                    component={Link}
                                    to="/login"
                                    className="hdr-login-btn"
                                    sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                                >
                                    Log in
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    className="hdr-register-btn"
                                    sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                                >
                                    Create account
                                </Button>
                            </>
                        )}

                        {/* Mobile hamburger */}
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                display: { lg: 'none' },
                                color: '#fff',
                                bgcolor: 'rgba(255,255,255,0.08)',
                                borderRadius: '9px',
                                p: '7px',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                            }}
                        >
                            {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* ── Mobile Drawer ── */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{
                    sx: {
                        width: '82%', maxWidth: 320,
                        background: '#fff',
                        boxShadow: '-8px 0 40px rgba(15,45,107,0.15)',
                    }
                }}
            >
                {/* Drawer header */}
                <Box sx={{
                    px: 2.5, py: 2,
                    background: 'linear-gradient(135deg, #0f2d6b 0%, #2d6ef5 100%)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box sx={{
                            width: 34, height: 34, borderRadius: '8px',
                            bgcolor: 'rgba(255,255,255,0.18)',
                            display: 'grid', placeItems: 'center',
                            fontFamily: 'Syne, sans-serif', fontWeight: 800,
                            fontSize: '1rem', color: '#fff',
                        }}>P</Box>
                        <Typography sx={{
                            fontFamily: 'Syne, sans-serif', fontWeight: 800,
                            color: '#fff', fontSize: '1rem',
                        }}>eParking</Typography>
                    </Box>
                    <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff', p: '4px' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Nav links */}
                <Box sx={{ px: 1.5, pt: 1.5 }}>
                    <Typography sx={{
                        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#94a3b8', px: 1, mb: 0.5,
                    }}>Menu</Typography>
                </Box>
                <List sx={{ p: 0, px: 1 }}>
                    {publicLinks.map(link =>
                        link.scrollToId ? (
                            <ListItem key={link.label} disablePadding sx={{ mb: 0.25 }}>
                                <ListItemButton
                                    onClick={handleScrollToSection(link.scrollToId)}
                                    className="hdr-drawer-link"
                                    sx={{ borderRadius: '9px' }}
                                >
                                    <ListItemText
                                        primary={link.label}
                                        primaryTypographyProps={{
                                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                                            fontWeight: 600, fontSize: '0.92rem',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ) : (
                            <ListItem key={link.label} disablePadding sx={{ mb: 0.25 }}>
                                <ListItemButton
                                    component={Link}
                                    to={link.to}
                                    onClick={handleDrawerToggle}
                                    className={`hdr-drawer-link${isActive(link.to) ? ' active' : ''}`}
                                    sx={{ borderRadius: '9px' }}
                                >
                                    <ListItemText
                                        primary={link.label}
                                        primaryTypographyProps={{
                                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                                            fontWeight: 600, fontSize: '0.92rem',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    )}
                </List>

                <Divider sx={{ my: 1.5, mx: 2 }} />

                {/* Action buttons */}
                <Box sx={{ px: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                        component={Link}
                        to="/checkin"
                        onClick={handleDrawerToggle}
                        fullWidth
                        sx={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontWeight: 700, fontSize: '0.9rem',
                            textTransform: 'none', borderRadius: '10px',
                            py: 1.2,
                            background: 'linear-gradient(135deg,#10b981,#059669)',
                            color: '#fff',
                            boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
                            '&:hover': { background: 'linear-gradient(135deg,#059669,#047857)' },
                        }}
                    >
                        🚗 Check-In Now
                    </Button>

                    {!user && (
                        <>
                            <Button
                                component={Link}
                                to="/login"
                                onClick={handleDrawerToggle}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                    fontWeight: 600, fontSize: '0.9rem',
                                    textTransform: 'none', borderRadius: '10px',
                                    py: 1.1,
                                    borderColor: '#d0ddf0', color: '#1a4db3',
                                    '&:hover': { bgcolor: '#f0f5ff', borderColor: '#2d6ef5' },
                                }}
                            >
                                Log in
                            </Button>
                            <Button
                                component={Link}
                                to="/register"
                                onClick={handleDrawerToggle}
                                fullWidth
                                sx={{
                                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                                    fontWeight: 700, fontSize: '0.9rem',
                                    textTransform: 'none', borderRadius: '10px',
                                    py: 1.1,
                                    background: 'linear-gradient(135deg,#1a4db3,#2d6ef5)',
                                    color: '#fff',
                                    boxShadow: '0 4px 16px rgba(45,110,245,0.25)',
                                    '&:hover': { background: 'linear-gradient(135deg,#0f2d6b,#1a4db3)' },
                                }}
                            >
                                Create account
                            </Button>
                        </>
                    )}
                </Box>

                {/* Timer (mobile) */}
                {reservationInfo?.validUntil && !reservationInfo?.checkedIn && timeLeft && (
                    <Box sx={{ mx: 2.5, mt: 2, p: 1.5, borderRadius: '10px', bgcolor: '#fef9c3', border: '1px solid #fde68a' }}>
                        <Typography sx={{ fontWeight: 700, color: '#92400e', textAlign: 'center', fontSize: '0.85rem' }}>
                            ⏳ Reservation expires in {timeLeft}
                        </Typography>
                    </Box>
                )}
            </Drawer>
        </>
    );
};

export default Header;
