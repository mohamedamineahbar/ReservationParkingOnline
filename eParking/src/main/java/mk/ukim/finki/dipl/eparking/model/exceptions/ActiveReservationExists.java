package mk.ukim.finki.dipl.eparking.model.exceptions;

public class ActiveReservationExists extends RuntimeException {
    public ActiveReservationExists() {
        super("Active reservation exists");
    }
}
