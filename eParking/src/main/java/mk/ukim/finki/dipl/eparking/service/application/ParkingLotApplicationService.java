package mk.ukim.finki.dipl.eparking.service.application;

import mk.ukim.finki.dipl.eparking.dto.CreateParkingLotDto;
import mk.ukim.finki.dipl.eparking.dto.DisplayParkingLotDto;
import mk.ukim.finki.dipl.eparking.model.ParkingLot;

import java.util.List;
import java.util.Optional;

public interface ParkingLotApplicationService {

    List<DisplayParkingLotDto> findAll();

    Optional<DisplayParkingLotDto> findById(Long id);

    Optional<DisplayParkingLotDto> update(Long id, CreateParkingLotDto parkingLot);

    void deleteById(Long id);

    Optional<DisplayParkingLotDto> save(CreateParkingLotDto parkingLot);
}
