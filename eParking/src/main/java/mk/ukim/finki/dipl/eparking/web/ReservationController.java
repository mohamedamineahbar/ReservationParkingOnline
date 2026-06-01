package mk.ukim.finki.dipl.eparking.web;

import mk.ukim.finki.dipl.eparking.dto.CreateReservationDto;
import mk.ukim.finki.dipl.eparking.dto.DisplayReservationDto;
import mk.ukim.finki.dipl.eparking.service.application.ReservationApplicationService;
import mk.ukim.finki.dipl.eparking.service.domain.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationApplicationService reservationApplicationService;
    private final ReservationService reservationService;

    public ReservationController(ReservationApplicationService reservationApplicationService, ReservationService reservationService) {
        this.reservationApplicationService = reservationApplicationService;
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<DisplayReservationDto> createReservation(@RequestBody CreateReservationDto dto) {
        Optional<DisplayReservationDto> created = reservationApplicationService.createReservation(dto);
        return created.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @GetMapping("/me")
    public ResponseEntity<DisplayReservationDto> getMyActiveReservation() {
        Optional<DisplayReservationDto> reservation = reservationApplicationService.getMyActiveReservation();
        return reservation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> cancelMyReservation() {
        reservationApplicationService.cancelMyReservation();
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/checkin")
    public ResponseEntity<DisplayReservationDto> checkIn(@RequestParam String entryCode) {
        Optional<DisplayReservationDto> reservation = reservationApplicationService.checkIn(entryCode);
        return reservation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PostMapping("/checkout")
    public ResponseEntity<DisplayReservationDto> checkOut(@RequestParam String exitCode) {
        Optional<DisplayReservationDto> reservation = reservationApplicationService.checkOut(exitCode);
        return reservation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PostMapping("/payments/confirm/{paymentIntentId}")
    public ResponseEntity<Void> confirmPayment(@PathVariable String paymentIntentId) {
        reservationService.markAsPaid(paymentIntentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<DisplayReservationDto>> getReservationHistory() {
        List<DisplayReservationDto> history = reservationApplicationService.getReservationHistoryForUser();
        return ResponseEntity.ok(history);
    }

    @PostMapping("/calculate-extra-payment")
    public ResponseEntity<DisplayReservationDto> calculateExtraPayment() {
        Optional<DisplayReservationDto> result = reservationApplicationService.calculateExtraPayment();
        return result.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }
    @PostMapping("/confirm-extra-payment/{paymentIntentId}")
    public ResponseEntity<Void> confirmExtraPayment(@PathVariable String paymentIntentId) {
        reservationService.confirmExtraPayment(paymentIntentId);
        return ResponseEntity.ok().build();
    }



    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }




}
