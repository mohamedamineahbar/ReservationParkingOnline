package mk.ukim.finki.dipl.eparking.repository;

import mk.ukim.finki.dipl.eparking.model.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {
}
