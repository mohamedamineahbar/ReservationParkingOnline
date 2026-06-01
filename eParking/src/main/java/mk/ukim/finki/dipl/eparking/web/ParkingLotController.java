package mk.ukim.finki.dipl.eparking.web;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import mk.ukim.finki.dipl.eparking.dto.CreateParkingLotDto;
import mk.ukim.finki.dipl.eparking.dto.DisplayParkingLotDto;
import mk.ukim.finki.dipl.eparking.service.application.ParkingLotApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parkinglots")
@Tag(name = "ParkingLot API", description = "Endpoints for managing parking lots") //
public class ParkingLotController {

    private final ParkingLotApplicationService parkingLotApplicationService;

    public ParkingLotController(ParkingLotApplicationService parkingLotApplicationService) {
        this.parkingLotApplicationService = parkingLotApplicationService;
    }

    @Operation(
            summary = "Get all parking lots", description = "Retrieves a list of all available parking lots."
    )
    @GetMapping
    public List<DisplayParkingLotDto> findAll() {
        return parkingLotApplicationService.findAll();
    }

    @Operation(summary = "Get parkingLot by ID", description = "Finds a parkingLot by its ID.")
    @GetMapping("/{id}")
    public ResponseEntity<DisplayParkingLotDto> findById(@PathVariable Long id) {
        return parkingLotApplicationService.findById(id)
                .map(parkingLot -> ResponseEntity.ok().body(parkingLot))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<DisplayParkingLotDto> save(@RequestBody CreateParkingLotDto createParkingLotDto) {
        return parkingLotApplicationService.save(createParkingLotDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Update an existing parking lot", description = "Updates a parking lot by ID.")
    @PutMapping("/edit/{id}")
    public ResponseEntity<DisplayParkingLotDto> update(
            @PathVariable Long id,
            @RequestBody CreateParkingLotDto createParkingLotDto
    ) {
        return parkingLotApplicationService.update(id, createParkingLotDto)
                .map(parkingLot -> ResponseEntity.ok().body(parkingLot))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Delete a parking lot", description = "Deletes a parking lot by its ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (parkingLotApplicationService.findById(id).isPresent()) {
            parkingLotApplicationService.deleteById(id); return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
