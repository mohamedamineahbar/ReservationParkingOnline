package mk.ukim.finki.dipl.eparking.model.exceptions;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String username) {
        super(String.format("User with username '%s' does not exist.", username));
    }

}
