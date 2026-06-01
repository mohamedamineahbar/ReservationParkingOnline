package mk.ukim.finki.dipl.eparking.dto;

import mk.ukim.finki.dipl.eparking.model.ParkingLot;

import java.util.List;
import java.util.stream.Collectors;

public record CreateParkingLotDto(
        String name,

        String address,

        Double latitude,

        Double longitude,

        Integer totalSpots,

        Integer availableSpots,

        Integer pricePerHour
) {
    public static CreateParkingLotDto from(ParkingLot parkingLot) {
        return new CreateParkingLotDto(
                parkingLot.getName(),
                parkingLot.getAddress(),
                parkingLot.getLatitude(),
                parkingLot.getLongitude(),
                parkingLot.getTotalSpots(),
                parkingLot.getAvailableSpots(),
                parkingLot.getPricePerHour()
        );
    }

    public static List<CreateParkingLotDto> from(List<ParkingLot> parkingLots) {
        return parkingLots.stream().map(CreateParkingLotDto::from).collect(Collectors.toList());
    }



    public ParkingLot toParkingLot() {
        return new ParkingLot(name, address, latitude, longitude, totalSpots, availableSpots, pricePerHour);
    }
}
