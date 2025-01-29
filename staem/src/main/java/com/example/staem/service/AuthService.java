package com.example.staem.service;

import com.example.staem.dto.UserDTO;
import com.example.staem.model.Role;
import com.example.staem.model.User;
import com.example.staem.model.UserInfoDetails;
import com.example.staem.repo.RoleRepo;
import com.example.staem.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    private final AuthenticationService authenticationService;

    @Autowired
    public AuthService(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> userDetail = userRepo.findByUsername(username);

        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));
    }

    public void saveUser(UserDTO userDto) {
        LocalDateTime date = userDto.getCreatedAt();
        User user = new User();

        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setFirstname(userDto.getFirstname());
        user.setLastname(userDto.getLastname());
        user.setCoins(100.0);
        user.setCreatedAt(date);

        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        Role defaultRole = roleRepo.findByRoleName("USER").orElseThrow(() -> new UsernameNotFoundException("Role not found."));
        user.setRoleName(defaultRole);

        userRepo.save(user);
    }

//    public String loginUser(AuthRequest authRequest) {
//        Authentication authentication = authenticationService.authenticate(
//                authRequest.getUsername(), authRequest.getPassword());
//        if (authentication.isAuthenticated()) {
//            return "Authenticated";
//        } else {
//            throw new UsernameNotFoundException("Invalid user request!");
//        }
//    }
}
