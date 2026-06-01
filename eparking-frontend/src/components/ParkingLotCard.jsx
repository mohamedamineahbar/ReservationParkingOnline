// src/components/ParkingLotCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {isAdmin} from "../utils/jwtUtils.js";

const ParkingLotCard = ({ lot, onReserveNow, onReserveAndPay, onEdit, onDelete }) => {
    const isAdminUser = isAdmin();
    return (
        <Card
            sx={{
                boxShadow: 2,
                borderRadius: 2,
                padding: { xs: 1.5, sm: 2 },
                backgroundColor: 'white',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 6,
                    backgroundColor: '#f0f8ff',
                },
            }}
        >
            <CardContent sx={{ padding: '0 !important', '&:last-child': { paddingBottom: '8px' } }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                        color: '#1e40af',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: "'Poppins', sans-serif",
                    }}
                >
                    <DirectionsCarIcon sx={{ marginRight: '0.5rem', fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                    {lot.name}
                </Typography>

                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' }, color: '#1e293b', fontFamily: "'Poppins', sans-serif", marginBottom: 0.5 }}>
                    📍 {lot.address}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' }, color: '#1e293b', fontFamily: "'Poppins', sans-serif", marginBottom: 0.5 }}>
                    💰 {lot.pricePerHour} MAD / hour
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '0.95rem' }, color: '#1e293b', marginBottom: '0.75rem', fontFamily: "'Poppins', sans-serif" }}>
                    🅿️ Available: <strong>{lot.availableSpots}</strong> / {lot.totalSpots}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
                    {isAdminUser && (
                        <>
                            <Button 
                                onClick={onEdit} 
                                color="warning"
                                size="small"
                                sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}
                            >
                                Edit
                            </Button>
                            <Button 
                                onClick={onDelete} 
                                color="error"
                                size="small"
                                sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onReserveNow}
                        startIcon={<PaymentIcon sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />}
                        size="small"
                        sx={{
                            flexGrow: 1,
                            fontFamily: "'Poppins', sans-serif",
                            textTransform: 'none',
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                        }}
                    >
                        Pay Later
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={onReserveAndPay}
                        startIcon={<CreditCardIcon sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />}
                        size="small"
                        sx={{
                            flexGrow: 1,
                            fontFamily: "'Poppins', sans-serif",
                            textTransform: 'none',
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                            padding: { xs: '4px 8px', sm: '6px 12px' },
                        }}
                    >
                        Pay Now
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ParkingLotCard;
