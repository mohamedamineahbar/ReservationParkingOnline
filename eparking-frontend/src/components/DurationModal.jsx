import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const durationOptions = [
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1h 30min', value: 90 },
    { label: '2 hours', value: 120 },
    { label: '2h 30min', value: 150 },
    { label: '3 hours', value: 180 },
    { label: '4 hours', value: 240 },
    { label: '6 hours', value: 360 },
    { label: '12 hours', value: 720 },
    { label: '24 hours', value: 1440 },
];

const DurationModal = ({
                           open,
                           onClose,
                           parkingLot,
                           onConfirm
                       }) => {
    const [duration, setDuration] = useState(60); // Default: 1 hour
    const pricePerHour = parkingLot?.pricePerHour || 0;

    // Calculate price in Moroccan Dirham (MAD)
    const priceMAD = Math.round((pricePerHour * duration) / 60);
    // Approximate MAD -> EUR conversion rate (adjust if you want a live rate)
    const MAD_TO_EUR = 0.089;
    const priceEUR = (priceMAD * MAD_TO_EUR).toFixed(2);

    const handleConfirm = () => {
        onConfirm(duration);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                fontFamily: 'Poppins, sans-serif',
            }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, color: '#1e40af', fontFamily: 'Poppins, sans-serif' }}
                >
                    ⏱️ Select Duration
                </Typography>

                <FormControl fullWidth sx={{ mt: 2, fontFamily: 'Poppins, sans-serif' }}>
                    <InputLabel id="duration-select-label" sx={{ fontFamily: 'Poppins, sans-serif' }}>Duration</InputLabel>
                    <Select
                        labelId="duration-select-label"
                        value={duration}
                        label="Duration"
                        onChange={(e) => setDuration(e.target.value)}
                        sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {durationOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Stack spacing={1.2} sx={{ mt: 3, fontFamily: 'Poppins, sans-serif' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                        💰 Total Price:
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        <strong>{priceMAD} MAD</strong>
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        (≈ {priceEUR} EUR)
                    </Typography>
                </Stack>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        mt: 3,
                        fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif',
                        borderRadius: 2,
                        textTransform: 'none',
                    }}
                    onClick={handleConfirm}
                >
                    Confirm and Pay
                </Button>
            </Box>
        </Modal>
    );
};

export default DurationModal;
