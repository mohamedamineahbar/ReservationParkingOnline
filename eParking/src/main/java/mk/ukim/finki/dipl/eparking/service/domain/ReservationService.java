package mk.ukim.finki.dipl.eparking.service.domain;

import mk.ukim.finki.dipl.eparking.model.Reservation;
import mk.ukim.finki.dipl.eparking.model.User;

import java.util.List;
import java.util.Optional;

public interface ReservationService {
    Optional<Reservation> save(Reservation reservation);

    Optional<Reservation> findById(Long id);

    void cancelReservation(Long id);

    Optional<Reservation> findActiveReservationByUser(User user);

    boolean hasActiveReservation(User user);
    Optional<Reservation> findByEntryCode(String entryCode);
    Optional<Reservation> findByExitCode(String exitCode);
    void markAsPaid(String paymentIntentId);

    List<Reservation> findByUser(User user);
    void confirmExtraPayment(String paymentIntentId);
    List<Reservation> getAllReservations();
    void deleteReservation(Long id);
    void deleteByUser(User user);



}