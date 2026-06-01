import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Button,
    Box
} from '@mui/material';

const ParkingLotFormModal = ({ open, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        totalSpots: '',
        availableSpots: '',
        pricePerHour: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                address: '',
                latitude: '',
                longitude: '',
                totalSpots: '',
                availableSpots: '',
                pricePerHour: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSubmit({
            ...formData,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            totalSpots: parseInt(formData.totalSpots),
            availableSpots: parseInt(formData.availableSpots),
            pricePerHour: parseInt(formData.pricePerHour)
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    bgcolor: 'white',
                    borderRadius: 4,
                    p: 3,
                    boxShadow: 6,
                }}
            >
                <DialogTitle
                    sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        color: '#1e40af',
                        textAlign: 'center',
                        mb: 2
                    }}
                >
                    {initialData ? "Edit Parking Lot" : "Add Parking Lot"}
                </DialogTitle>

                <DialogContent>
                    <Grid container spacing={2}>
                        {[
                            { label: 'Name', name: 'name' },
                            { label: 'Address', name: 'address' },
                        ].map((field) => (
                            <Grid item xs={12} key={field.name}>
                                <TextField
                                    placeholder={field.label}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                    InputProps={{ sx: { fontFamily: 'Poppins, sans-serif' } }}
                                />
                            </Grid>
                        ))}

                        <Grid item xs={6}>
                            <TextField
                                placeholder="Latitude"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                type="number"
                                InputProps={{ sx: { fontFamily: 'Poppins, sans-serif' } }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                placeholder="Longitude"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                type="number"
                                InputProps={{ sx: { fontFamily: 'Poppins, sans-serif' } }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                placeholder="Total Spots"
                                name="totalSpots"
                                value={formData.totalSpots}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                type="number"
                                InputProps={{ sx: { fontFamily: 'Poppins, sans-serif' } }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                placeholder="Available Spots"
                                name="availableSpots"
                                value={formData.availableSpots}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                type="number"
                                InputProps={{ sx: { fontFamily: 'Poppins, sans-serif' } }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                placeholder="Price Per Hour"
                                name="pricePerHour"
                                value={formData.pricePerHour}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                type="number"
                                InputProps={{ sx: { fontFamily: 'Poppins, sans-serif' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ mt: 3, justifyContent: 'flex-end' }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        color="secondary"
                        sx={{
                            fontWeight: 600,
                            fontFamily: 'Poppins, sans-serif',
                            textTransform: 'none',
                            px: 3,
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        sx={{
                            fontWeight: 600,
                            fontFamily: 'Poppins, sans-serif',
                            textTransform: 'none',
                            px: 3,
                        }}
                    >
                        {initialData ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ParkingLotFormModal;
