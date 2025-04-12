package com.example.staem.dto;

import com.example.staem.model.Game;
import com.example.staem.model.GameGenre;
import com.example.staem.model.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameDTO {

    private Long gameId;
    private String title;
    private String description;
    private Double price;
    private Double diskSize;
    private List<String> genres;
    private List<Long> genreIds;

    public GameDTO(Game game, List<GameGenre> gameGenres) {
        this.gameId = game.getGameId();
        this.title = game.getTitle();
        this.description = game.getDescription();
        this.price = game.getPrice();
        this.diskSize = game.getDiskSize();
        this.genres = gameGenres.stream()
                .map(gameGenre -> gameGenre.getGenreId().getGenreName())
                .collect(Collectors.toList());
        this.genreIds = gameGenres.stream()
                .map(gameGenre -> gameGenre.getGenreId().getGenreId())
                .collect(Collectors.toList());
    }
}
