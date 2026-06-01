package mk.ukim.finki.dipl.eparking.dto;

import mk.ukim.finki.dipl.eparking.model.Reservation;
import mk.ukim.finki.dipl.eparking.model.enums.ReservationType;

import java.time.LocalDateTime;

public record DisplayReservationDto(
        Long id,
        String parkingLotName,
        ReservationType type,
        String entryCode,
        String exitCode,
        boolean checkedIn,
        boolean checkedOut,
        boolean paid,
        LocalDateTime createdAt,
        LocalDateTime validUntil,
        String clientSecret,
        Double amountMKD,
        Double amountEUR
) {
    public static DisplayReservationDto from(Reservation reservation, String clientSecret) {
        double amountMKD = reservation.getParkingLot().getPricePerHour()
                * (reservation.getDurationInMinutes() / 60.0);
        double amountEUR = amountMKD * 0.0162;

        return new DisplayReservationDto(
                reservation.getId(),
                reservation.getParkingLot().getName(),
                reservation.getType(),
                reservation.getEntryCode(),
                reservation.getExitCode(),
                reservation.isCheckedIn(),
                reservation.isCheckedOut(),
                reservation.isPaid(),
                reservation.getCreatedAt(),
                reservation.getValidUntil(),
                clientSecret,
                amountMKD,
                amountEUR
        );
    }

    public static DisplayReservationDto from(Reservation reservation) {
        return from(reservation, null);
    }
}
