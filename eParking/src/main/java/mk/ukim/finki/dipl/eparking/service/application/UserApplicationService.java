package mk.ukim.finki.dipl.eparking.service.application;

import mk.ukim.finki.dipl.eparking.dto.LoginUserRequestDto;
import mk.ukim.finki.dipl.eparking.dto.LoginUserResponseDto;
import mk.ukim.finki.dipl.eparking.dto.RegisterUserRequestDto;
import mk.ukim.finki.dipl.eparking.dto.RegisterUserResponseDto;

import java.util.Optional;

public interface UserApplicationService {
    Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto);

    Optional<LoginUserResponseDto> login(LoginUserRequestDto loginUserRequestDto);

    Optional<RegisterUserResponseDto> findByUsername(String username);
}

