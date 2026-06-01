package mk.ukim.finki.dipl.eparking.service.domain;

import mk.ukim.finki.dipl.eparking.model.ParkingLot;

import java.util.List;
import java.util.Optional;

public interface ParkingLotService {

    List<ParkingLot> findAll();

    Optional<ParkingLot> findById(Long id);

    Optional<ParkingLot> update(Long id, ParkingLot parkingLot);

    void deleteById(Long id);

    Optional<ParkingLot> save(ParkingLot parkingLot);
}
