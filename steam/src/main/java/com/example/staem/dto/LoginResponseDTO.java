package com.example.staem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private Long userId;
    private String username;
    private String firstname;
    private String lastname;
    private Double coins;
    private String role;
}
