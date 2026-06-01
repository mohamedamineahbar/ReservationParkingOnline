package mk.ukim.finki.dipl.eparking.dto;

import mk.ukim.finki.dipl.eparking.model.User;

public record RegisterUserRequestDto(
        String username,
        String password,
        String name,
        String surname,
        String email
) {

    public User toUser() {
        return new User(username, password, name, surname, email);
    }

}
