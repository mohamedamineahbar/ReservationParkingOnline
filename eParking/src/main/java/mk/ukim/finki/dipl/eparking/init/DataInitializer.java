package mk.ukim.finki.dipl.eparking.init;

import jakarta.annotation.PostConstruct;
import mk.ukim.finki.dipl.eparking.model.ParkingLot;
import mk.ukim.finki.dipl.eparking.model.User;
import mk.ukim.finki.dipl.eparking.model.enums.Role;
import mk.ukim.finki.dipl.eparking.repository.ParkingLotRepository;
import mk.ukim.finki.dipl.eparking.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataInitializer {
    private final ParkingLotRepository parkingLotRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ParkingLotRepository parkingLotRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.parkingLotRepository = parkingLotRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if (parkingLotRepository.count() == 0)
        {
            parkingLotRepository.save(new ParkingLot(
                    "Javor Trade Center Parking",
                    "Filip II Makedonski 52, Bitola",
                    41.032947,
                    21.336954,
                    30,
                    20,
                    50
            ));

            parkingLotRepository.save(new ParkingLot(
                    "NI Cultural Center",
                    "Pece Matichevski 15, Bitola",
                    41.028147482389606,
                    21.335769025791066,
                    50,
                    45,
                    40
            ));

            parkingLotRepository.save(new ParkingLot(
                    "Sports Hall",
                    "Ilija Nikolovski Luj, Bitola",
                    41.02277912846161,
                    21.336492103932823,
                    80,
                    80,
                    30
            ));

            parkingLotRepository.save(new ParkingLot(
                    "Stopanska Banka a.d. Bitola",
                    "Dobrivoe Radosavljevikj 21, Bitola",
                    41.03052130272328,
                    21.336395654349957,
                    50,
                    30,
                    50
            ));
            parkingLotRepository.save(new ParkingLot(
                    "Bliss - Mall & Retail Park",
                    "Ilindenska 1G, Bitola",
                    41.039229766110815,
                    21.3464029802362,
                    100,
                    60,
                    50
            ));
        }
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(new User(
                    "admin",
                    passwordEncoder.encode("admin"),
                    "Kristina",
                    "Ivanovska",
                    "admin@eparking.com",
                    Role.ROLE_ADMIN
            ));
        }
    }
}
