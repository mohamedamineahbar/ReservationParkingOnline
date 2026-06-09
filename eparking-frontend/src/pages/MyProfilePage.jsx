import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';

import {
    Box,
    Typography,
    Button,
    Divider,
    Stack,
    Paper,
    CircularProgress,
    Alert,
    Chip,
} from '@mui/material';
import {
    Person as PersonIcon,
    Badge as BadgeIcon,
    Email as EmailIcon,
    LocalParking as ParkingIcon,
    ConfirmationNumber as CodeIcon,
    Event as EventIcon,
    Payment as PaymentIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { cancelMyReservation } from "../repository/reservationRepository.js";

const MyProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeReservation, setActiveReservation] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAllHistory, setShowAllHistory] = useState(false);
    const navigate = useNavigate();
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleString();
    };

    const handleCancelReservation = async () => {
        try {
            await cancelMyReservation();
            setActiveReservation(null);
            setShowCancelDialog(false);
        } catch (err) {
            alert("Failed to cancel the reservation.");
            console.error(err);
        }
    };
    const formatDurationLeft = (reservation) => {
        if (!reservation.checkedIn || !reservation.checkedInAt || !reservation.durationInMinutes) return null;

        const checkInTime = new Date(reservation.checkedInAt).getTime();
        const expireTime = checkInTime + reservation.durationInMinutes * 60000;
        const now = Date.now();
        const diffMs = expireTime - now;
        if (diffMs <= 0) return "Expired";

        const minutesLeft = Math.floor(diffMs / 60000);
        const hours = Math.floor(minutesLeft / 60);
        const minutes = minutesLeft % 60;

        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };


    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Cache-Control': 'no-cache',
                Authorization: `Bearer ${token}`,
            },
        };

        const fetchActiveReservation = axios.get(
            'http://localhost:8080/api/reservations/me',
            config
        );
        const fetchHistory = axios.get(
            'http://localhost:8080/api/reservations/history',
            config
        );

        Promise.all([fetchActiveReservation, fetchHistory])
            .then(([activeRes, historyRes]) => {
                setActiveReservation(activeRes.status === 204 ? null : activeRes.data);
                setHistory(Array.isArray(historyRes.data) ? historyRes.data : []);
            })
            .catch((err) => {
                setError('Failed to load reservations.');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [user]);


    useEffect(() => {
        if (!activeReservation) return;

        let expiryTime;

        if (
            activeReservation.checkedIn &&
            activeReservation.checkedInAt &&
            activeReservation.durationInMinutes
        ) {
            const checkInTime = new Date(activeReservation.checkedInAt);
            expiryTime = new Date(checkInTime.getTime() + activeReservation.durationInMinutes * 60000);
        } else if (activeReservation.validUntil) {
            expiryTime = new Date(activeReservation.validUntil);
        } else {
            return;
        }

        const now = Date.now();
        const timeLeft = expiryTime.getTime() - now;

        if (timeLeft <= 0) {
            cancelMyReservation()
                .then(() => setActiveReservation(null))
                .catch(err => console.error("Auto-cancel failed:", err));
            return;
        }

        const timeoutId = setTimeout(() => {
            cancelMyReservation()
                .then(() => setActiveReservation(null))
                .catch(err => console.error("Auto-cancel failed:", err));
        }, timeLeft);

        return () => clearTimeout(timeoutId);
    }, [activeReservation]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const StatusChip = ({ label, success }) => (
        <Chip
            label={label}
            size="small"
            icon={success ? <CheckCircleIcon /> : <CloseIcon />}
            color={success ? 'success' : 'error'}
            sx={{ fontWeight: 600, mr: 1 }}
        />
    );

    if (loading) {
        return (
            <Box mt={6} textAlign="center">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={6} maxWidth={600} mx="auto">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box mt={6} maxWidth={600} mx="auto" textAlign="center">
                <Typography variant="h6">You are not logged in.</Typography>
                <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
                    Go to Login
                </Button>
            </Box>
        );
    }

    return (
        <Box
            component={Paper}
            elevation={0}
            sx={{
                width: '100%',
                maxWidth: 960,
                mx: 'auto',
                mt: 12,
                p: 5,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                fontFamily: 'Poppins, sans-serif',
                color: '#1e293b',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        fontWeight: 600,
                        px: 3,
                        py: 1.2,
                        borderRadius: 9999,
                        textTransform: 'none',
                        backgroundColor: '#ef4444',
                        '&:hover': { backgroundColor: '#dc2626' },
                    }}
                >
                    Logout
                </Button>
            </Box>

            <Typography variant="h4" fontWeight={700} mb={3} color="#1e40af" sx={{ userSelect: 'none' }}>
                👤 My Profile
            </Typography>

            {/* User Info Section */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                    p: 4,
                    '&:hover': {
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                    },
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={3} color="#334e68">
                    User Info
                </Typography>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                        <Typography>
                            <strong>Username:</strong> {user.username || 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BadgeIcon color="primary" sx={{ mr: 1 }} />
                        <Typography>
                            <strong>Name:</strong> {user.name ? `${user.name} ${user.surname || ''}` : 'N/A'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon color="primary" sx={{ mr: 1 }} />
                        <Typography>
                            <strong>Email:</strong> {user.email || 'N/A'}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Divider />

            {/* Active Reservation Section */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                    p: 4,
                    '&:hover': {
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                    },
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={3} color="#334e68">
                    Active Reservation
                </Typography>
                {activeReservation ? (
                    <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ParkingIcon color="secondary" sx={{ mr: 1 }} />
                            <Typography>
                                <strong>Parking Lot:</strong> {activeReservation.parkingLotName}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon color="secondary" sx={{ mr: 1 }} />
                            <Typography>
                                <strong>Type:</strong> {activeReservation.type}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CodeIcon color="secondary" sx={{ mr: 1 }} />
                            <Typography>
                                <strong>Entry Code:</strong> {activeReservation.entryCode}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' , gap: 1 }}>
                            <EventIcon color="secondary" sx={{ mr: 1 }} />
                            <Typography>
                                <strong>Valid Until:</strong> {formatDate(activeReservation.validUntil)}
                            </Typography>
                        </Box>
                        {activeReservation.checkedIn && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EventIcon color="secondary" sx={{ mr: 1 }} />
                                <Typography>
                                    <strong>Time Left:</strong> {formatDurationLeft(activeReservation)}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StatusChip label="Checked In" success={activeReservation.checkedIn} />
                            <StatusChip label="Checked Out" success={activeReservation.checkedOut} />
                            <StatusChip label="Paid" success={activeReservation.paid} />
                            <Button
                                variant="contained"
                                onClick={() => setShowCancelDialog(true)}
                                sx={{
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1.5,
                                    marginLeft:37,
                                    borderRadius: 9999,
                                    backgroundColor: '#1e40af',
                                    '&:hover': {
                                        backgroundColor: '#2754e1',
                                    },
                                }}
                            >
                                Cancel Reservation
                            </Button>
                        </Box>
                    </Stack>
                ) : (
                    <Typography>No active reservation.</Typography>
                )}
            </Box>

            <Divider />

            {/* Reservation History Section */}
            <Box
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)',
                    p: 4,
                    '&:hover': {
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                    },
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={3} color="#334e68">
                    Reservation History
                </Typography>

                {history.length > 0 ? (
                    <Box
                        sx={{
                            maxHeight: showAllHistory ? 500 : 300,
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: 2,
                            p: 2,
                            backgroundColor: '#f9fafb',
                        }}
                    >
                        {(showAllHistory ? history : history.slice(0, 3)).map((res) => (
                            <Paper
                                key={res.id}
                                elevation={1}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.1)' },
                                    transition: 'box-shadow 0.3s ease',
                                }}
                            >
                                <Stack spacing={0.7}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ParkingIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography>
                                            <strong>Parking Lot:</strong> {res.parkingLotName}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EventIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography>
                                            <strong>Type:</strong> {res.type}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CodeIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography>
                                            <strong>Entry Code:</strong> {res.entryCode}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CodeIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography>
                                            <strong>Exit Code:</strong> {res.exitCode || 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EventIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography>
                                            <strong>Created At:</strong> {formatDate(res.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EventIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography>
                                            <strong>Valid Until:</strong> {formatDate(res.validUntil)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <StatusChip label="Checked In" success={res.checkedIn} />
                                        <StatusChip label="Checked Out" success={res.checkedOut} />
                                        <StatusChip label="Paid" success={res.paid} />
                                    </Box>
                                </Stack>
                            </Paper>
                        ))}

                        {history.length > 3 && (
                            <Button
                                onClick={() => setShowAllHistory(!showAllHistory)}
                                variant="text"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    fontWeight: 600,
                                    color: '#1e40af',
                                    '&:hover': { backgroundColor: '#e0e7ff' },
                                }}
                            >
                                {showAllHistory ? 'Show Less' : 'Show More'}
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Typography>No reservation history found.</Typography>
                )}
            </Box>

            <Dialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
            >
                <DialogTitle>Cancel Reservation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel your reservation? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCancelDialog(false)}
                            sx={{
                                backgroundColor: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#cccfdc',
                                },
                            }}>
                        No
                    </Button>
                    <Button
                        onClick={handleCancelReservation}
                        autoFocus
                        variant="contained"
                        sx={{
                            backgroundColor: '#1e40af',
                            '&:hover': {
                                backgroundColor: '#2754e1',
                            },
                        }}
                    >
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default MyProfile;
