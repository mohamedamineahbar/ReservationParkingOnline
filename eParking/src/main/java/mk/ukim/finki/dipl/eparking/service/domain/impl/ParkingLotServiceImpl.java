package mk.ukim.finki.dipl.eparking.service.domain.impl;


import mk.ukim.finki.dipl.eparking.model.ParkingLot;
import mk.ukim.finki.dipl.eparking.repository.ParkingLotRepository;
import mk.ukim.finki.dipl.eparking.service.domain.ParkingLotService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParkingLotServiceImpl implements ParkingLotService {

    private final ParkingLotRepository parkingLotRepository;

    public ParkingLotServiceImpl(ParkingLotRepository parkingLotRepository) {
        this.parkingLotRepository = parkingLotRepository;
    }


    @Override
    public List<ParkingLot> findAll() {
        return parkingLotRepository.findAll();
    }

    @Override
    public Optional<ParkingLot> findById(Long id) {
        return parkingLotRepository.findById(id);
    }

    @Override
    public Optional<ParkingLot> update(Long id, ParkingLot parkingLot) {
        return parkingLotRepository.findById(id).map(existingParkingLot -> {
            if (existingParkingLot.getName() != null) {
                existingParkingLot.setName(parkingLot.getName());
            }
            if (parkingLot.getAddress() != null) {
                existingParkingLot.setAddress(parkingLot.getAddress());
            }
            if (parkingLot.getLongitude() != null) {
                existingParkingLot.setLongitude(parkingLot.getLongitude());
            }
            if (parkingLot.getLatitude() != null) {
                existingParkingLot.setLatitude(parkingLot.getLatitude());
            }
            if (parkingLot.getAvailableSpots() != null) {
                existingParkingLot.setAvailableSpots(parkingLot.getAvailableSpots());
            }
            if (parkingLot.getTotalSpots() != null) {
                existingParkingLot.setTotalSpots(parkingLot.getTotalSpots());
            }
            if (parkingLot.getPricePerHour() != null) {
                existingParkingLot.setPricePerHour(parkingLot.getPricePerHour());
            }

            return parkingLotRepository.save(existingParkingLot);
        });
    }

    @Override
    public void deleteById(Long id) {
        parkingLotRepository.deleteById(id);
    }

    @Override
    public Optional<ParkingLot> save(ParkingLot parkingLot) {
        return Optional.of(parkingLotRepository.save(parkingLot));
    }
}
