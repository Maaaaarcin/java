package com.example.staem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GameGenre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_genre_id")
    private Long gameGenreId;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "game_id", nullable = false)
    private Game gameId;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genreId;
}
