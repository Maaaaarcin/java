package com.example.staem.controller;

import com.example.staem.dto.UserDTO;
import com.example.staem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/users")
    public List<UserDTO> userList() {
        return userService.userList();
    }

    @GetMapping("/user")
    public Optional<UserDTO> userData(@RequestParam String username) {
        return userService.userData(username);
    }

    @Transactional
    @DeleteMapping("/user")
    public String userDeletion(@RequestParam String username) {
        return userService.userDeletion(username);
    }
}
