package com.example.staem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    private String username;
    private String password;
    private String firstname;
    private String lastname;
    private LocalDateTime createdAt;
    @Column(columnDefinition="Decimal(6,2) default '100.00'")
    private Double coins;
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role roleName;
}
