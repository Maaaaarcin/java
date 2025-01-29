package com.example.staem.controller;

import com.example.staem.dto.GameDTO;
import com.example.staem.model.Game;
import com.example.staem.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/games")
public class GameController {

    private final GameService gameService;

    @GetMapping
    public List<GameDTO> getAllGames() {
        return gameService.gameList();
    }

    @GetMapping("/{id}")
    public GameDTO getGameById(@PathVariable Long id) {
        return gameService.gameData(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    @PostMapping
    public GameDTO createGame(@RequestBody GameDTO gameDto) {
        return gameService.gameInsertion(gameDto);
    }

    @PutMapping("/{id}")
    public GameDTO updateGame(@PathVariable Long id, @RequestBody Game game) {
        game.setGameId(id);
        return gameService.gameUpdate(game);
    }

    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.gameDeletion(id);
    }

    @PostMapping("/buyGame/{userId}/{gameId}")
    public String buyGame(@PathVariable Long userId, @PathVariable Long gameId) {
        return gameService.buyGame(userId, gameId);
    }
}
