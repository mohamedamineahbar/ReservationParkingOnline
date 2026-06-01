package mk.ukim.finki.dipl.eparking.model.exceptions;

public class NoAvailableSpotsException extends RuntimeException {
    public NoAvailableSpotsException(String message) {
        super(message);
    }
}
