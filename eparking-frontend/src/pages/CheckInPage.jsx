import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Divider,
    Paper,
    Collapse,
} from "@mui/material";
import { checkInReservation, checkOutReservation } from "../repository/parkingLotRepository";
import { getMyReservation } from "../repository/reservationRepository.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "../components/StripeCheckoutForm";
import { useReservation } from "../context/ReservationContext.jsx";

const stripePromise = loadStripe("pk_test_51RdC2j2ctYJPxxeKBXNtebRqzBYhHjxBFYfYVyQZ75xEy3mEx4c6oywjBYZVZPyeWWZ4KeZGvkjJJUAtLNWF0Ps3001PvKnpwx");

const CheckInPage = () => {
    const { setReservationInfo } = useReservation();
    const [entryCode, setEntryCode] = useState("");
    const [exitCode, setExitCode] = useState(null);
    const [checkOutCode, setCheckOutCode] = useState("");
    const [checkInError, setCheckInError] = useState(null);
    const [checkOutError, setCheckOutError] = useState(null);
    const [checkOutSuccess, setCheckOutSuccess] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [showStripe, setShowStripe] = useState(false);
    const [paymentSuccessMessage, setPaymentSuccessMessage] = useState(null);

    const updateReservationState = (reservation, fromCheckIn = false) => {
        setReservationInfo(reservation);
        setClientSecret(reservation.clientSecret || null);

        if (fromCheckIn) {
            setShowStripe(reservation.type === "PAY_NOW" && !reservation.paid && reservation.clientSecret);
        } else {
            setShowStripe(false);
        }

        if (
            reservation.type === "NOW_PAY_LATER" ||
            (reservation.type === "PAY_NOW" && reservation.paid)
        ) {
            setExitCode(reservation.exitCode);
        } else {
            setExitCode(null);
        }
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();
        setCheckInError(null);
        setCheckOutError(null);
        setCheckOutSuccess(null);
        setPaymentSuccessMessage(null);

        try {
            const reservation = await checkInReservation(entryCode);
            updateReservationState(reservation, true);
        } catch (err) {
            setCheckInError("❌ Check-in failed. Please verify your entry code.");
            setExitCode(null);
            setShowStripe(false);
        }
    };

    useEffect(() => {
        const fetchActiveReservation = async () => {
            try {
                const res = await getMyReservation();
                if (res.checkedIn && !res.checkedOut) {
                    updateReservationState(res);
                }
            } catch (err) {
                console.warn("No active reservation or error:", err);
            }
        };
        fetchActiveReservation();
    }, []);

    useEffect(() => {
        if (paymentSuccessMessage) {
            const timer = setTimeout(() => setPaymentSuccessMessage(null), 6000);
            return () => clearTimeout(timer);
        }
    }, [paymentSuccessMessage]);

    const handleCheckOut = async (e) => {
        e.preventDefault();
        setCheckOutError(null);
        setCheckOutSuccess(null);

        try {
            await checkOutReservation(checkOutCode);
            setCheckOutSuccess("✅ Check-out successful! Thank you.");
            setExitCode(null);
            setCheckOutCode("");
        } catch (err) {
            if (err.response && err.response.data) {
                setCheckOutError(`${err.response.data}`);
            } else {
                setCheckOutError("❌ Check-out failed. Please verify your exit code.");
            }
        }
    };

    const handlePaymentSuccess = async () => {
        setShowStripe(false);
        setPaymentSuccessMessage("✅ Payment successful! You can now see your exit code.");
        try {
            const updatedReservation = await getMyReservation();
            updateReservationState(updatedReservation);
        } catch (err) {
            console.error("Failed to refresh reservation after payment.");
        }
    };

    return (
        <Box
            maxWidth="700px"
            width="100%"
            mx="auto"
            mt={6}
            p={5}
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: 3,
                fontFamily: "Poppins, sans-serif",
                minHeight: exitCode ? "580px" : "auto",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 600,
                    color: "#1e40af",
                    fontFamily: "Poppins, sans-serif",
                    mb: 3,
                }}
            >
                🚘 Check-In
            </Typography>

            {!exitCode && !showStripe && (
                <form onSubmit={handleCheckIn}>
                    <TextField
                        label="Entry Code"
                        fullWidth
                        required
                        value={entryCode}
                        onChange={(e) => setEntryCode(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{ sx: { fontFamily: "Poppins, sans-serif" } }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        sx={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            py: 1.2,
                            borderRadius: 2,
                        }}
                    >
                        Check In
                    </Button>
                </form>
            )}

            {checkInError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {checkInError}
                </Alert>
            )}

            {paymentSuccessMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {paymentSuccessMessage}
                </Alert>
            )}

            <Collapse in={showStripe} timeout="auto" unmountOnExit>
                <Box
                    mt={4}
                    sx={{
                        width: "100%",
                        maxWidth: "550px",
                        mx: "auto",
                        p: 3,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: 400,
                        overflowY: "auto",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, mb: 2 }}
                    >
                        💳 Complete Payment
                    </Typography>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripeCheckoutForm onPaymentSuccess={handlePaymentSuccess} />
                    </Elements>
                </Box>
            </Collapse>

            {exitCode && !showStripe && (
                <Box mt={5} flexGrow={1} display="flex" flexDirection="column">
                    <Divider sx={{ mb: 3 }} />
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                    >
                        🎟️ Your Exit Code
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ mt: 1, mb: 3, fontSize: "1.25rem", fontWeight: 600 }}
                    >
                        {exitCode}
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                        Save this code — you will need it to check out.
                    </Typography>

                    <Divider sx={{ my: 3 }} />
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                    >
                        🚪 Check-Out
                    </Typography>
                    <form onSubmit={handleCheckOut} style={{ marginTop: "auto" }}>
                        <TextField
                            label="Exit Code"
                            fullWidth
                            required
                            value={checkOutCode}
                            onChange={(e) => setCheckOutCode(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="success"
                            sx={{
                                mt: 2,
                                py: 1.2,
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            Check Out
                        </Button>
                    </form>
                    {checkOutError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {checkOutError}
                        </Alert>
                    )}
                    {checkOutSuccess && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {checkOutSuccess}
                        </Alert>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default CheckInPage;
