package com.example.staem.controller;

import com.example.staem.dto.UserDTO;
import com.example.staem.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String registerUser(@RequestBody UserDTO userDto) {
        try {
            authService.saveUser(userDto);
            return "Successfully added.";
        } catch (Exception e) {
            return "Failed to create a user.";
        }
    }

//    @PostMapping("/login")
//    public String loginUser(@RequestBody AuthRequest authRequest) {
//        return authService.loginUser(authRequest);
//    }
}
