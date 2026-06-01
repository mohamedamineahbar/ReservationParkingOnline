// StripeCheckoutForm.jsx
import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const StripeCheckoutForm = ({ onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/payment-success",
            },
            redirect: "if_required",
        });

        if (error) {
            alert(error.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            await fetch(`http://localhost:8080/api/reservations/payments/confirm/${paymentIntent.id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            onPaymentSuccess();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
            <PaymentElement
                options={{ layout: "tabs" }}
                style={{ width: "100%", fontFamily: "Poppins, sans-serif" }}
            />
            <button
                type="submit"
                disabled={!stripe}
                style={{
                    marginTop: "auto",
                    padding: "12px 0",
                    fontWeight: 600,
                    fontFamily: "Poppins, sans-serif",
                    backgroundColor: "#1e40af",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e3a8a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
            >
                Pay
            </button>
        </form>
    );
};

export default StripeCheckoutForm;
