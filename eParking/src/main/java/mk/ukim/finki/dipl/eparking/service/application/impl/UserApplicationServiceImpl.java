package mk.ukim.finki.dipl.eparking.service.application.impl;


import mk.ukim.finki.dipl.eparking.dto.LoginUserRequestDto;
import mk.ukim.finki.dipl.eparking.dto.LoginUserResponseDto;
import mk.ukim.finki.dipl.eparking.dto.RegisterUserRequestDto;
import mk.ukim.finki.dipl.eparking.dto.RegisterUserResponseDto;
import mk.ukim.finki.dipl.eparking.model.User;
import mk.ukim.finki.dipl.eparking.service.domain.UserService;
import mk.ukim.finki.dipl.eparking.helpers.JwtHelper;
import mk.ukim.finki.dipl.eparking.service.application.UserApplicationService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;
    private final JwtHelper jwtHelper;

    public UserApplicationServiceImpl(UserService userService, JwtHelper jwtHelper) {
        this.userService = userService;
        this.jwtHelper = jwtHelper;
    }

    @Override
    public Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto) {
        User user = userService.register(registerUserRequestDto.toUser());
        RegisterUserResponseDto displayUserDto = RegisterUserResponseDto.from(user);
        return Optional.of(displayUserDto);
    }

    @Override
    public Optional<LoginUserResponseDto> login(LoginUserRequestDto loginUserRequestDto) {
        User user = userService.login(loginUserRequestDto.username(), loginUserRequestDto.password());

        String token = jwtHelper.generateToken(user);

        return Optional.of(new LoginUserResponseDto(token));
    }

    @Override
    public Optional<RegisterUserResponseDto> findByUsername(String username) {
        return userService
                .findByUsername(username)
                .map(RegisterUserResponseDto::from);
    }

}