package com.example.staem.service;

import com.example.staem.dto.UserDTO;
import com.example.staem.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;

    public List<UserDTO> userList() {
        return userRepo.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> userData(String username) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String user = authentication.getName();
        System.out.println("Name: " + user + "\n Credentials " + authentication.getCredentials() + user + "\n  Authorities" + authentication.getAuthorities() + user + "\n Principal " + authentication.getPrincipal() + user + "\n Details " + authentication.getDetails());
        return userRepo.findByUsername(username).map(UserDTO::new);
    }

    public String userDeletion(String username) {
        userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found."));
        userRepo.deleteByUsername(username);

        return "Account deleted.";
    }
}
