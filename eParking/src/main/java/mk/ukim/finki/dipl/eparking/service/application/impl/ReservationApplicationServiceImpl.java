package mk.ukim.finki.dipl.eparking.service.application.impl;

import com.stripe.model.PaymentIntent;
import mk.ukim.finki.dipl.eparking.dto.CreateReservationDto;
import mk.ukim.finki.dipl.eparking.dto.DisplayReservationDto;
import mk.ukim.finki.dipl.eparking.model.Reservation;
import mk.ukim.finki.dipl.eparking.model.enums.ReservationType;
import mk.ukim.finki.dipl.eparking.model.User;
import mk.ukim.finki.dipl.eparking.model.exceptions.ActiveReservationExists;
import mk.ukim.finki.dipl.eparking.model.exceptions.NoAvailableSpotsException;
import mk.ukim.finki.dipl.eparking.repository.ParkingLotRepository;
import mk.ukim.finki.dipl.eparking.repository.UserRepository;
import mk.ukim.finki.dipl.eparking.service.application.ReservationApplicationService;
import mk.ukim.finki.dipl.eparking.service.domain.ReservationService;
import mk.ukim.finki.dipl.eparking.service.domain.impl.StripeService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationApplicationServiceImpl implements ReservationApplicationService {

    private final ReservationService reservationService;
    private final ParkingLotRepository parkingLotRepository;
    private final UserRepository userRepository;
    private final StripeService stripeService;

    public ReservationApplicationServiceImpl(ReservationService reservationService,
                                             ParkingLotRepository parkingLotRepository,
                                             UserRepository userRepository,
                                             StripeService stripeService) {
        this.reservationService = reservationService;
        this.parkingLotRepository = parkingLotRepository;
        this.userRepository = userRepository;
        this.stripeService = stripeService;
    }

    @Override
    public Optional<DisplayReservationDto> createReservation(CreateReservationDto dto) {
        User user = getCurrentUser();

        if (reservationService.hasActiveReservation(user)) {
            throw new ActiveReservationExists();
        }

        return parkingLotRepository.findById(dto.parkingLotId()).map(parkingLot -> {
            if (parkingLot.getAvailableSpots() <= 0) {
                throw new NoAvailableSpotsException("No available spots in parking lot.");
            }

            Reservation reservation = new Reservation(
                    user,
                    parkingLot,
                    dto.type(),
                    generateVerificationCode("CODE"),
                    generateVerificationCode("EXIT"),
                    LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(30),
                    false,
                    dto.durationInMinutes()
            );

            Optional<Reservation> savedReservation = reservationService.save(reservation);

            parkingLot.setAvailableSpots(parkingLot.getAvailableSpots() - 1);
            parkingLotRepository.save(parkingLot);

            return savedReservation.map(DisplayReservationDto::from);
        }).orElse(Optional.empty());
    }

    @Override
    public Optional<DisplayReservationDto> getMyActiveReservation() {
        return reservationService.findActiveReservationByUser(getCurrentUser())
                .map(reservation -> {
                    String clientSecret = null;
                    if (reservation.getStripePaymentIntentId() != null) {
                        try {
                            clientSecret = stripeService.retrieveClientSecret(reservation.getStripePaymentIntentId());
                        } catch (Exception e) {
                            System.err.println("Failed to get clientSecret from Stripe: " + e.getMessage());
                        }
                    }
                    return DisplayReservationDto.from(reservation, clientSecret);
                });
    }


    @Override
    public void cancelMyReservation() {
        reservationService.findActiveReservationByUser(getCurrentUser())
                .ifPresent(res -> {
                    parkingLotRepository.findById(res.getParkingLot().getId()).ifPresent(parkingLot -> {
                        parkingLot.setAvailableSpots(parkingLot.getAvailableSpots() + 1);
                        parkingLotRepository.save(parkingLot);
                    });

                    reservationService.cancelReservation(res.getId());
                });
    }

    @Override
    public Optional<DisplayReservationDto> checkIn(String entryCode) {
        Optional<Reservation> optReservation = reservationService.findByEntryCode(entryCode);

        if (optReservation.isEmpty()) {
            return Optional.empty();
        }



        Reservation reservation = optReservation.get();

        if (!reservation.isActive() || reservation.isCheckedIn()) {
            return Optional.empty();
        }
        if (reservation.getValidUntil().isBefore(LocalDateTime.now())) {
            reservation.setActive(false);

            reservation.getParkingLot().setAvailableSpots(reservation.getParkingLot().getAvailableSpots() + 1);
            parkingLotRepository.save(reservation.getParkingLot());

            reservationService.save(reservation);
            throw new IllegalStateException("Entry code has expired. Please make a new reservation.");
        }



        reservation.setCheckedIn(true);
        reservation.setCheckedInAt(LocalDateTime.now());

        String clientSecret = null;

        if (reservation.getType() == ReservationType.PAY_NOW) {
            long pricePerHourMKD = reservation.getParkingLot().getPricePerHour();
            long durationMinutes = reservation.getDurationInMinutes();

            double amountMKD = pricePerHourMKD * (durationMinutes / 60.0);
            double mkdToEurRate = 0.0162;
            double amountEUR = amountMKD * mkdToEurRate;
            long amountEuroCents = Math.max(Math.round(amountEUR * 100), 50);

            try {
                PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                        amountEuroCents,
                        "eur",
                        "Parking Reservation at " + reservation.getParkingLot().getName()
                );

                reservation.setStripePaymentIntentId(paymentIntent.getId());
                clientSecret = paymentIntent.getClientSecret();
            } catch (Exception e) {
                System.err.println("Stripe payment creation failed: " + e.getMessage());
                return Optional.empty();
            }
        }

        Reservation saved = reservationService.save(reservation).orElseThrow();
        return Optional.of(DisplayReservationDto.from(saved, clientSecret));
    }


    @Override
    public Optional<DisplayReservationDto> checkOut(String exitCode) {
        Optional<Reservation> optReservation = reservationService.findByExitCode(exitCode);

        if (optReservation.isEmpty()) {
            return Optional.empty();
        }

        Reservation reservation = optReservation.get();

        if (!reservation.isActive() || !reservation.isCheckedIn() || reservation.isCheckedOut()) {
            return Optional.empty();
        }

        if (reservation.getCheckedInAt() != null &&
                reservation.getDurationInMinutes() > 0) {

            LocalDateTime parkingEndTime = reservation.getCheckedInAt().plusMinutes(reservation.getDurationInMinutes());

            if (LocalDateTime.now().isAfter(parkingEndTime)) {
                throw new IllegalStateException("Your paid parking time has expired. Please contact support.");
            }
        }

        reservation.setCheckedOut(true);
        reservation.setCheckedOutAt(LocalDateTime.now());
        reservation.setActive(false);

        parkingLotRepository.findById(reservation.getParkingLot().getId()).ifPresent(parkingLot -> {
            parkingLot.setAvailableSpots(parkingLot.getAvailableSpots() + 1);
            parkingLotRepository.save(parkingLot);
        });

        Reservation saved = reservationService.save(reservation).orElseThrow();
        return Optional.of(DisplayReservationDto.from(saved));
    }


    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String generateVerificationCode(String prefix) {
        return prefix + "-" + String.format("%06d", (int) (Math.random() * 1_000_000));
    }

    @Override
    public List<DisplayReservationDto> getReservationHistoryForUser() {
        User currentUser = getCurrentUser();

        List<Reservation> reservations = reservationService.findByUser(currentUser).stream()
                .filter(r -> !r.isActive())
                .collect(Collectors.toList());

        return reservations.stream()
                .map(DisplayReservationDto::from)
                .collect(Collectors.toList());
    }
    @Override
    public Optional<DisplayReservationDto> calculateExtraPayment() {
        User user = getCurrentUser();
        Optional<Reservation> optionalReservation = reservationService.findActiveReservationByUser(user);

        if (optionalReservation.isEmpty()) return Optional.empty();

        Reservation reservation = optionalReservation.get();

        if (!reservation.isCheckedIn() || reservation.isCheckedOut()) return Optional.empty();

        LocalDateTime expectedCheckout = reservation.getCheckedInAt().plusMinutes(reservation.getDurationInMinutes());
        LocalDateTime now = LocalDateTime.now();

        if (!now.isAfter(expectedCheckout)) {
            return Optional.empty();
        }

        long extraMinutes = java.time.Duration.between(expectedCheckout, now).toMinutes();
        if (extraMinutes <= 0) return Optional.empty();

        long pricePerHour = reservation.getParkingLot().getPricePerHour();
        double extraAmountMKD = pricePerHour * (extraMinutes / 60.0);
        double mkdToEurRate = 0.0162;
        long amountEuroCents = Math.max(Math.round(extraAmountMKD * mkdToEurRate * 100), 50);

        try {
            PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                    amountEuroCents,
                    "eur",
                    "Extra parking fee at " + reservation.getParkingLot().getName()
            );

            reservation.setPendingExtensionMinutes((int) extraMinutes);
            reservation.setExtensionPaymentIntentId(paymentIntent.getId());
            reservationService.save(reservation);

            return Optional.of(DisplayReservationDto.from(reservation, paymentIntent.getClientSecret()));
        } catch (Exception e) {
            System.err.println("Stripe error: " + e.getMessage());
            return Optional.empty();
        }
    }







}
