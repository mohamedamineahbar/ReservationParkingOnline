package mk.ukim.finki.dipl.eparking.dto;

import mk.ukim.finki.dipl.eparking.model.enums.Role;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Role role;

    public UserDto(String username, String email, Role role) {
        this.username = username;
        this.email = email;
        this.role = role;
    }

}