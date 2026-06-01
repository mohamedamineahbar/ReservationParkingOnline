package mk.ukim.finki.dipl.eparking.service.application;

import mk.ukim.finki.dipl.eparking.dto.CreateReservationDto;
import mk.ukim.finki.dipl.eparking.dto.DisplayReservationDto;

import java.util.List;
import java.util.Optional;

public interface ReservationApplicationService {

    Optional<DisplayReservationDto> createReservation(CreateReservationDto dto);

    Optional<DisplayReservationDto> getMyActiveReservation();

    void cancelMyReservation();

    Optional<DisplayReservationDto> checkIn(String entryCode);

    Optional<DisplayReservationDto> checkOut(String exitCode);
    List<DisplayReservationDto> getReservationHistoryForUser();
    Optional<DisplayReservationDto> calculateExtraPayment();



}
