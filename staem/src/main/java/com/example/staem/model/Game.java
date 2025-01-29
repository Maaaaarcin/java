package com.example.staem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_id")
    private Long gameId;
    private String title;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "genre_id", nullable = false)
    private Genre genreName;
    @Column(name = "disk_size")
    private Double diskSize;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Double price;
    @OneToMany(mappedBy = "game")
    @JsonBackReference
    private Set<UserLibrary> userLibraries = new HashSet<>();
}
