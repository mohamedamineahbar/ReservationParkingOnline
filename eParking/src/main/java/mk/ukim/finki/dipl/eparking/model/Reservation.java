package mk.ukim.finki.dipl.eparking.model;

import jakarta.persistence.*;
import lombok.Data;
import mk.ukim.finki.dipl.eparking.model.enums.ReservationType;

import java.time.LocalDateTime;

@Entity
@Data
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @ManyToOne(optional = false)
    private ParkingLot parkingLot;

    @Enumerated(EnumType.STRING)
    private ReservationType type; // NOW_PAY_LATER or PAY_NOW

    private String entryCode; // e.g., CODE-123456
    private String exitCode;  // e.g., EXIT-123456

    private boolean checkedIn = false;
    private boolean checkedOut = false;

    private LocalDateTime createdAt;
    private LocalDateTime validUntil;
    private LocalDateTime checkedInAt;
    private LocalDateTime checkedOutAt;

    private boolean active = true;

    private boolean isPaid = false;
    private Integer durationInMinutes;


    private String stripePaymentIntentId;
    private Integer pendingExtensionMinutes;
    private String extensionPaymentIntentId;



    public Reservation() {}

    public Reservation(User user,
                       ParkingLot parkingLot,
                       ReservationType type,
                       String entryCode,
                       String exitCode,
                       LocalDateTime createdAt,
                       LocalDateTime validUntil,
                       boolean isPaid,
                       Integer durationInMinutes
) {
        this.user = user;
        this.parkingLot = parkingLot;
        this.type = type;
        this.entryCode = entryCode;
        this.exitCode = exitCode;
        this.createdAt = createdAt;
        this.validUntil = validUntil;
        this.isPaid = isPaid;
        this.durationInMinutes=durationInMinutes;
        this.checkedIn = false;
        this.checkedOut = false;
        this.checkedInAt = null;
        this.checkedOutAt = null;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ParkingLot getParkingLot() {
        return parkingLot;
    }

    public void setParkingLot(ParkingLot parkingLot) {
        this.parkingLot = parkingLot;
    }

    public ReservationType getType() {
        return type;
    }

    public void setType(ReservationType type) {
        this.type = type;
    }

    public String getEntryCode() {
        return entryCode;
    }

    public void setEntryCode(String entryCode) {
        this.entryCode = entryCode;
    }

    public String getExitCode() {
        return exitCode;
    }

    public void setExitCode(String exitCode) {
        this.exitCode = exitCode;
    }

    public boolean isCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(boolean checkedIn) {
        this.checkedIn = checkedIn;
    }

    public boolean isCheckedOut() {
        return checkedOut;
    }

    public void setCheckedOut(boolean checkedOut) {
        this.checkedOut = checkedOut;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public LocalDateTime getCheckedInAt() {
        return checkedInAt;
    }

    public void setCheckedInAt(LocalDateTime checkedInAt) {
        this.checkedInAt = checkedInAt;
    }

    public LocalDateTime getCheckedOutAt() {
        return checkedOutAt;
    }

    public void setCheckedOutAt(LocalDateTime checkedOutAt) {
        this.checkedOutAt = checkedOutAt;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public void setPaid(boolean paid) {
        isPaid = paid;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }

    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    public Integer getDurationInMinutes() {
        return durationInMinutes;
    }

    public void setDurationInMinutes(Integer durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public Integer getPendingExtensionMinutes() {
        return pendingExtensionMinutes;
    }

    public String getExtensionPaymentIntentId() {
        return extensionPaymentIntentId;
    }

    public void setPendingExtensionMinutes(Integer pendingExtensionMinutes) {
        this.pendingExtensionMinutes = pendingExtensionMinutes;
    }

    public void setExtensionPaymentIntentId(String extensionPaymentIntentId) {
        this.extensionPaymentIntentId = extensionPaymentIntentId;
    }
}
