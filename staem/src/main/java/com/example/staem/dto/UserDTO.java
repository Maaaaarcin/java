package com.example.staem.dto;

import com.example.staem.model.User;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UserDTO implements Serializable {
    private String username;
    private String password;
    private String email;
    private String firstname;
    private String lastname;
    private String roleName;
    private LocalDateTime createdAt;

    public UserDTO() {
    }

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.roleName = user.getRoleName().getRoleName();
        this.createdAt = user.getCreatedAt();
    }
}
