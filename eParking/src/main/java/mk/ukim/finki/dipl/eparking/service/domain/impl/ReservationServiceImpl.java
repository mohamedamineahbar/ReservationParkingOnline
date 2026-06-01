package mk.ukim.finki.dipl.eparking.service.domain.impl;

import mk.ukim.finki.dipl.eparking.model.Reservation;
import mk.ukim.finki.dipl.eparking.model.User;
import mk.ukim.finki.dipl.eparking.repository.ReservationRepository;
import mk.ukim.finki.dipl.eparking.service.domain.ReservationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public Optional<Reservation> save(Reservation reservation) {
        return Optional.of(reservationRepository.save(reservation));
    }

    @Override
    public Optional<Reservation> findById(Long id) {
        return reservationRepository.findById(id);
    }

    @Override
    public void cancelReservation(Long id) {
        reservationRepository.findById(id).ifPresent(res -> {
            res.setActive(false);
            reservationRepository.save(res);
        });
    }

    @Override
    public Optional<Reservation> findActiveReservationByUser(User user) {
        return reservationRepository.findByUserAndActiveTrue(user);
    }

    @Override
    public boolean hasActiveReservation(User user) {
        return reservationRepository.existsByUserAndActiveTrue(user);
    }

    @Override
    public Optional<Reservation> findByEntryCode(String entryCode) {
        return reservationRepository.findByEntryCode(entryCode);
    }

    @Override
    public Optional<Reservation> findByExitCode(String exitCode) {
        return reservationRepository.findByExitCode(exitCode);
    }
    @Override
    public void markAsPaid(String paymentIntentId) {
        Optional<Reservation> opt = reservationRepository.findByStripePaymentIntentId(paymentIntentId);
        if (opt.isPresent()) {
            Reservation reservation = opt.get();
            reservation.setPaid(true);
            reservationRepository.save(reservation);
        } else {
            throw new IllegalArgumentException("No reservation found for PaymentIntent ID: " + paymentIntentId);
        }
    }

    @Override
    public List<Reservation> findByUser(User user) {
        return reservationRepository.findByUser(user);
    }

    @Override
    public void confirmExtraPayment(String paymentIntentId) {
        Reservation reservation = (Reservation) reservationRepository.findByExtensionPaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        int extraMinutes = reservation.getPendingExtensionMinutes();
        reservation.setDurationInMinutes(reservation.getDurationInMinutes() + extraMinutes);
        reservation.setPendingExtensionMinutes(0);
        reservation.setExtensionPaymentIntentId(null);

        reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
    @Override
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public void deleteByUser(User user) {
        List<Reservation> reservations = findByUser(user);
        reservationRepository.deleteAll(reservations);
    }


}

