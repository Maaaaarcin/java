package com.example.staem.service;

import com.example.staem.dto.LoginResponseDTO;
import com.example.staem.dto.UserDTO;
import com.example.staem.model.AuthRequest;
import com.example.staem.model.Role;
import com.example.staem.model.User;
import com.example.staem.model.UserInfoDetails;
import com.example.staem.repo.RoleRepo;
import com.example.staem.repo.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userDetail = userRepo.findByUsername(username);

        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));
    }

    public void saveUser(UserDTO userDto) {

        if(userRepo.findByUsername(userDto.getUsername()).isPresent()) {
            throw new UsernameNotFoundException("Username is taken.");
        }

        LocalDateTime date = LocalDateTime.now();
        User user = new User();

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

    public LoginResponseDTO loginUser(AuthRequest authRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(),
                            authRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            User user = userRepo.findByUsername(authRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return new LoginResponseDTO(
                    user.getUserId(),
                    user.getUsername(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getCoins(),
                    user.getRoleName().getRoleName()
            );
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }

        String username = authentication.getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}