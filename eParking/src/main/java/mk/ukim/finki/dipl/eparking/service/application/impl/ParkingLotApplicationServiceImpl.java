package mk.ukim.finki.dipl.eparking.service.application.impl;

import mk.ukim.finki.dipl.eparking.dto.CreateParkingLotDto;
import mk.ukim.finki.dipl.eparking.dto.DisplayParkingLotDto;
import mk.ukim.finki.dipl.eparking.service.application.ParkingLotApplicationService;
import mk.ukim.finki.dipl.eparking.service.domain.ParkingLotService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParkingLotApplicationServiceImpl implements ParkingLotApplicationService {

    private final ParkingLotService parkingLotService;

    public ParkingLotApplicationServiceImpl(ParkingLotService parkingLotService) {
        this.parkingLotService = parkingLotService;
    }

    @Override
    public List<DisplayParkingLotDto> findAll() {
        return DisplayParkingLotDto.from(parkingLotService.findAll());
    }

    @Override
    public Optional<DisplayParkingLotDto> findById(Long id) {
        return parkingLotService.findById(id).map(DisplayParkingLotDto::from);
    }

    @Override
    public Optional<DisplayParkingLotDto> update(Long id, CreateParkingLotDto parkingLot) {
        return parkingLotService.update(id, parkingLot.toParkingLot())
                .map(DisplayParkingLotDto::from);
    }

    @Override
    public void deleteById(Long id) {
        parkingLotService.deleteById(id);
    }

    @Override
    public Optional<DisplayParkingLotDto> save(CreateParkingLotDto parkingLot) {
        return parkingLotService.save(parkingLot.toParkingLot())
                .map(DisplayParkingLotDto::from);
    }
}
