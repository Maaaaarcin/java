package com.example.staem.service;

import com.example.staem.dto.UserDTO;
import com.example.staem.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;

    public List<UserDTO.UserList> userList() {
        return userRepo.findAll().stream()
                .map(UserDTO.UserList::new)
                .collect(Collectors.toList());
    }

    public String userDeletion(String username) {
        userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found."));
        userRepo.deleteByUsername(username);

        return "Account deleted.";
    }

    public String updateUser(String username, UserDTO.UserUpdate updateRequest) {
        var user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        if (!user.getUsername().equals(updateRequest.getUsername())) {
            userRepo.findByUsername(updateRequest.getUsername()).ifPresent(existing -> {
                throw new IllegalArgumentException("Username already taken");
            });
            user.setUsername(updateRequest.getUsername());
        }

        user.setCoins(updateRequest.getCoins());
        userRepo.save(user);

        return "User updated.";
    }

}
