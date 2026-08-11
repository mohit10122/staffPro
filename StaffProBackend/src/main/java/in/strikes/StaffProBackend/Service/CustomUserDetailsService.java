package in.strikes.StaffProBackend.Service;

import in.strikes.StaffProBackend.entity.Login_detail;
import in.strikes.StaffProBackend.repository.LoginRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {


        private final LoginRepo loginRepo;

        public CustomUserDetailsService(LoginRepo loginRepo) {
            this.loginRepo = loginRepo;
        }

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
            try {


                Optional<Login_detail> userOpt = loginRepo.findByEmail(email);

                if (userOpt.isEmpty()) {

                    throw new UsernameNotFoundException( email);
                }

                Login_detail user = userOpt.get();


                return user;

            } catch (Exception e) {

                e.printStackTrace();
                throw e;
            }
        }
    }

