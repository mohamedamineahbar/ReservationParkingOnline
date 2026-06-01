package mk.ukim.finki.dipl.eparking.service.domain;

import mk.ukim.finki.dipl.eparking.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {
    User register(User user);

    User login(String username, String password);
    Optional<User> findByUsername(String username);
    List<User> getAllUsers();
    void deleteUser(String username);
}
