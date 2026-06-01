package mk.ukim.finki.dipl.eparking.service.domain.impl;

import mk.ukim.finki.dipl.eparking.model.Reservation;
import mk.ukim.finki.dipl.eparking.model.User;
import mk.ukim.finki.dipl.eparking.model.exceptions.IncorrectPasswordException;
import mk.ukim.finki.dipl.eparking.model.exceptions.UsernameAlreadyExistsException;
import mk.ukim.finki.dipl.eparking.repository.UserRepository;
import mk.ukim.finki.dipl.eparking.service.domain.ReservationService;
import mk.ukim.finki.dipl.eparking.service.domain.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReservationService reservationService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, ReservationService reservationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.reservationService = reservationService;
    }

    @Override
    public User register(User user) {
        if (findByUsername(user.getUsername()).isPresent())
            throw new UsernameAlreadyExistsException(user.getUsername());

        return userRepository.save(new User(
                user.getUsername(),
                passwordEncoder.encode(user.getPassword()),
                user.getName(),
                user.getSurname(),
                user.getEmail()
        ));
    }

    @Override
    public User login(String username, String password) {
        User user = findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new IncorrectPasswordException();
        return user;
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<Reservation> reservations = reservationService.findByUser(user);
        for (Reservation r : reservations) {
            reservationService.deleteByUser(user);
        }

        userRepository.deleteById(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

}

