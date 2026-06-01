package mk.ukim.finki.dipl.eparking.service.domain.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    /**
     * Create a PaymentIntent for PAY_NOW reservation
     *
     * @param amountCents Amount in cents (e.g. $10 = 1000)
     * @param currency Currency code (default: "usd")
     * @param description Description of the reservation/payment
     * @return clientSecret to be used on frontend with Stripe.js
     * @throws StripeException on failure to create the PaymentIntent
     */
    public PaymentIntent createPaymentIntent(Long amountCents, String currency, String description) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountCents)
                .setCurrency(currency)
                .setDescription(description)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }
    public String retrieveClientSecret(String paymentIntentId) throws Exception {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.getClientSecret();
    }

}