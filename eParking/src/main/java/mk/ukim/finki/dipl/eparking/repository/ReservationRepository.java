package mk.ukim.finki.dipl.eparking.repository;

import mk.ukim.finki.dipl.eparking.model.Reservation;
import mk.ukim.finki.dipl.eparking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUserAndActiveTrue(User user);
    boolean existsByUserAndActiveTrue(User user);
    Optional<Reservation> findByEntryCode(String entryCode);
    Optional<Reservation> findByExitCode(String exitCode);
    Optional<Reservation> findByStripePaymentIntentId(String stripePaymentIntentId);
    List<Reservation> findByUser(User user);

    Optional<Reservation> findByExtensionPaymentIntentId(String extensionPaymentIntentId);

}
