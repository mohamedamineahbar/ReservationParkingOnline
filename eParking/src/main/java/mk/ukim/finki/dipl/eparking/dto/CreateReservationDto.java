package mk.ukim.finki.dipl.eparking.dto;

import mk.ukim.finki.dipl.eparking.model.enums.ReservationType;

public record CreateReservationDto(
        Long parkingLotId,
        ReservationType type,
        Integer durationInMinutes
) {
}