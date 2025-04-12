package com.example.staem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class UserLibrary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_library_id")
    private Long userLibraryId;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;
}
