import React, { useEffect, useState, useRef } from 'react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReservation } from '../context/ReservationContext';

const ReservationModal = ({
                              open,
                              onClose,
                              reservationInfo,
                              clientSecret,
                              paymentSuccess
                          }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const notifiedRef = useRef(false);
    const { setReservationInfo } = useReservation();

    useEffect(() => {
        if (open && reservationInfo) {
            setReservationInfo(reservationInfo);
        }
    }, [open, reservationInfo, setReservationInfo]);

    useEffect(() => {
        if (!reservationInfo?.validUntil) return;

        const interval = setInterval(() => {
            const now = new Date();
            const expiry = new Date(reservationInfo.validUntil);
            const diff = Math.max(0, Math.floor((expiry - now) / 1000));

            const minutes = Math.floor(diff / 60);
            const seconds = diff % 60;
            setTimeLeft(`${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`);

            if (!notifiedRef.current && diff <= 300 && diff > 0) {
                toast.warn('⚠️ Your reservation will expire in 5 minutes!');
                notifiedRef.current = true;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reservationInfo?.validUntil]);

    return (
        <Modal open={open} onClose={onClose}>
            <>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 420,
                    bgcolor: '#ffffff',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                    fontFamily: 'Poppins, sans-serif',
                }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1e40af' }}>
                        🚘 Reservation Details
                    </Typography>

                    {reservationInfo && (
                        <Stack spacing={1.2}>
                            <Typography><strong>Entry Code:</strong> {reservationInfo.entryCode}</Typography>
                            <Typography><strong>Parking Lot:</strong> {reservationInfo.parkingLotName}</Typography>
                            <Typography>
                                <strong>Valid Until:</strong> {new Date(reservationInfo.validUntil).toLocaleString()}
                            </Typography>
                            <Typography sx={{ color: '#b91c1c' }}>
                                ⏳ Time Left: {timeLeft}
                            </Typography>

                            {clientSecret && !paymentSuccess && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#b91c1c' }}>
                                        Payment Required
                                    </Typography>
                                    <Typography>Total: <strong>{reservationInfo.amountMKD?.toFixed(2)} MKD</strong></Typography>
                                    <Typography>(≈ {reservationInfo.amountEUR?.toFixed(2)} EUR)</Typography>
                                </Box>
                            )}

                            {paymentSuccess && (
                                <Typography color="success.main" sx={{ mt: 2 }}>
                                    ✅ Payment successful! Your reservation is confirmed.
                                </Typography>
                            )}
                        </Stack>
                    )}

                    <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="primary"
                            sx={{
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 3,
                            }}
                        >
                            Close
                        </Button>

                        <Button
                            component={Link}
                            to="/checkin"
                            variant="contained"
                            color="success"
                            sx={{
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 3,
                            }}
                        >
                            Go to Check-In
                        </Button>
                    </Stack>
                </Box>
                <ToastContainer position="top-center" autoClose={5000} />
            </>
        </Modal>
    );
};

export default ReservationModal;
