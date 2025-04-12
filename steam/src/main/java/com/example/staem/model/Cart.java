package com.example.staem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;
    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game gameId;
}
