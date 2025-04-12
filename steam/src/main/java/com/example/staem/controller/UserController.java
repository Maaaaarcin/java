package com.example.staem.controller;

import com.example.staem.dto.UserDTO;
import com.example.staem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/users")
    public List<UserDTO.UserList> userList() {
        return userService.userList();
    }

    @Transactional
    @DeleteMapping("/user/{username}")
    public String userDeletion(@PathVariable String username) {
        return userService.userDeletion(username);
    }

    @PutMapping("/user/{username}")
    public String updateUser(@PathVariable String username, @RequestBody UserDTO.UserUpdate updateRequest) {
        return userService.updateUser(username, updateRequest);
    }
}
