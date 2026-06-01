package mk.ukim.finki.dipl.eparking.dto;

import mk.ukim.finki.dipl.eparking.model.ParkingLot;

import java.util.List;
import java.util.stream.Collectors;

public record DisplayParkingLotDto(
        Long id,
        String name,

        String address,

        Double latitude,

        Double longitude,

        Integer totalSpots,

        Integer availableSpots,

        Integer pricePerHour
) {
    public static DisplayParkingLotDto from(ParkingLot parkingLot) {
        return new DisplayParkingLotDto(
                parkingLot.getId(),
                parkingLot.getName(),
                parkingLot.getAddress(),
                parkingLot.getLatitude(),
                parkingLot.getLongitude(),
                parkingLot.getTotalSpots(),
                parkingLot.getAvailableSpots(),
                parkingLot.getPricePerHour()
        );
    }

    public static List<DisplayParkingLotDto> from(List<ParkingLot> parkingLots) {
        return parkingLots.stream()
                .map(DisplayParkingLotDto::from)
                .collect(Collectors.toList());
    }


}
