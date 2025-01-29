package com.example.staem.dto;

import com.example.staem.model.Game;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameDTO {

    private Long gameId;
    private String title;
    private String description;
    private Double price;
    private Double diskSize;
    private String genreName;

    public GameDTO(Game game) {
        this.gameId = game.getGameId();
        this.title = game.getTitle();
        this.description = game.getDescription();
        this.price = game.getPrice();
        this.diskSize = game.getDiskSize();
        this.genreName = game.getGenreName().getGenreName();
    }
}
