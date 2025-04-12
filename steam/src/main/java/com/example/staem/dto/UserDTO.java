package com.example.staem.dto;

import com.example.staem.model.User;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UserDTO implements Serializable {
    private String username;
    private String password;
    private String firstname;
    private String lastname;

    public UserDTO() {
    }

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
    }

    @Data
    public static class UserList implements Serializable {
        private String username;
        private Double coins;
        private LocalDateTime createdAt;

        public UserList(User user) {
            this.username = user.getUsername();
            this.coins = user.getCoins();
            this.createdAt = user.getCreatedAt();
        }
    }

    @Data
    public static class UserData implements Serializable {
        private String username;
        private String firstname;
        private String lastname;
        private String role;
        private LocalDateTime createdAt;
        private Double coins;

        public UserData(User user) {
            this.username = user.getUsername();
            this.firstname = user.getFirstname();
            this.lastname = user.getLastname();
            this.role = user.getRoleName().getRoleName();
            this.createdAt = user.getCreatedAt();
            this.coins = user.getCoins();
        }
    }

    @Data
    public static class UserUpdate implements Serializable {
        private String username;
        private Double coins;
    }
}

