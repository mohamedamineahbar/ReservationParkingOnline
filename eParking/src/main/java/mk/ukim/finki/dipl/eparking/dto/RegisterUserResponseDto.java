package mk.ukim.finki.dipl.eparking.dto;

import mk.ukim.finki.dipl.eparking.model.User;
import mk.ukim.finki.dipl.eparking.model.enums.Role;

public record RegisterUserResponseDto(
        String username,
        String name,
        String surname,
        String email,
        Role role
) {

    public static RegisterUserResponseDto from(User user) {
        return new RegisterUserResponseDto(
                user.getUsername(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getRole()
        );
    }

}