import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Header = () => {
    const { reservationInfo } = useReservation();
    const { user } = useContext(AuthContext);
    const [timeLeft, setTimeLeft] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Parking Lots', to: '/parking-lots' },
        ...(user ? [{ label: 'My Profile', to: '/my-profile' }] : []),
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(prev => !prev);
    };

    useEffect(() => {
        console.log('Reservation info changed:', reservationInfo);
    }, [reservationInfo]);

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

    return (
        <AppBar
            position="sticky"
            elevation={6}
            sx={{
                bgcolor: 'transparent',
                backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                fontFamily: 'Poppins, sans-serif',
                overflow: 'hidden',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    px: { xs: 1, sm: 2, md: 3 },
                    minHeight: { xs: 70, md: 80 },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flexWrap: 'wrap' }}>
                    <Box sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.18)',
                        display: 'grid',
                        placeItems: 'center',
                        boxShadow: '0 10px 30px rgba(15,23,42,0.18)',
                    }}>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                            e
                        </Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                color: '#ffffff',
                                letterSpacing: 0.8,
                                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem' },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            eParking Bitola
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.72)', display: { xs: 'none', sm: 'block' } }}
                        >
                            Smart parking made effortless
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: 'flex-end', flex: 1, flexWrap: 'wrap' }}>
                    {navLinks.map(link => (
                        <Button
                            key={link.label}
                            component={Link}
                            to={link.to}
                            sx={navButtonStyle}
                        >
                            {link.label}
                        </Button>
                    ))}
                    <Button
                        component={Link}
                        to="/checkin"
                        sx={{
                            ...checkInButtonStyle,
                            display: { xs: 'none', md: 'inline-flex' },
                        }}
                    >
                        Check-In
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, md: 0 } }}>
                    {reservationInfo?.validUntil && !reservationInfo?.checkedIn && timeLeft && (
                        <Box sx={timerStyle}>
                            <Typography sx={{ fontWeight: 700, color: '#facc15', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                                ⏳ {timeLeft}
                            </Typography>
                        </Box>
                    )}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        sx={{
                            display: { md: 'none' },
                            bgcolor: 'rgba(255,255,255,0.06)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' },
                        }}
                    >
                        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                </Box>
            </Toolbar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                PaperProps={{ sx: { width: '80%', maxWidth: 340 } }}
            >
                <Box sx={{ p: 2, bgcolor: '#2563eb', color: '#fff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Navigation
                        </Typography>
                        <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                        Tap to navigate or check in with one click.
                    </Typography>
                </Box>

                <List sx={{ p: 0 }}>
                    {navLinks.map(link => (
                        <ListItem key={link.label} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={link.to}
                                onClick={handleDrawerToggle}
                                sx={{ py: 1.4 }}
                            >
                                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 700 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 1 }} />
                <List sx={{ p: 0 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/checkin"
                            onClick={handleDrawerToggle}
                            sx={{
                                bgcolor: '#10b981',
                                color: '#fff',
                                mx: 2,
                                borderRadius: 2,
                                mt: 1,
                                '&:hover': { bgcolor: '#0f766e' },
                            }}
                        >
                            <ListItemText
                                primary="🚗 Check-In"
                                primaryTypographyProps={{ fontWeight: 700, textAlign: 'center' }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>

                {reservationInfo?.validUntil && !reservationInfo?.checkedIn && timeLeft && (
                    <Box sx={{ p: 2, mx: 2, mt: 2, borderRadius: 2, bgcolor: '#fef3c7' }}>
                        <Typography sx={{ fontWeight: 700, color: '#92400e', textAlign: 'center' }}>
                            ⏳ Time left: {timeLeft}
                        </Typography>
                    </Box>
                )}
            </Drawer>
        </AppBar>
    );
};

const navButtonStyle = {
    fontWeight: 600,
    fontFamily: 'Poppins, sans-serif',
    px: 2,
    py: 0.75,
    borderRadius: '999px',
    color: '#ffffff',
    border: '1.5px solid rgba(255,255,255,0.18)',
    textTransform: 'none',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.18)',
        transform: 'translateY(-1px)',
    },
};

const checkInButtonStyle = {
    fontWeight: 700,
    fontFamily: 'Poppins, sans-serif',
    px: 2.5,
    py: 0.85,
    borderRadius: '999px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    fontSize: '0.875rem',
    textTransform: 'none',
    boxShadow: '0 14px 32px rgba(16,185,129,0.18)',
    '&:hover': {
        backgroundColor: '#059669',
    },
};

const timerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 2,
    py: 0.8,
    borderRadius: '999px',
    bgcolor: 'rgba(255,255,255,0.16)',
    minWidth: 120,
};

export default Header;
