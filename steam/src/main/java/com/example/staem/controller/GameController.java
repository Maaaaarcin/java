package com.example.staem.controller;

import com.example.staem.dto.GameDTO;
import com.example.staem.model.Game;
import com.example.staem.service.GameService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/games")
public class GameController {

    private final GameService gameService;

    @GetMapping("")
    public List<GameDTO> getGames(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String query,
            @RequestParam(required = false, defaultValue = "0") Double minPrice,
            @RequestParam(required = false, defaultValue = "1000") Double maxPrice,
            @RequestParam(required = false) List<Long> genreIds
    ) {
        return gameService.getFilteredGames(username, query, minPrice, maxPrice, genreIds);
    }

    @GetMapping("/{id}")
    public GameDTO getGameById(@PathVariable Long id) {
        return gameService.gameData(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    @PostMapping("")
    public GameDTO createGame(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("diskSize") Double diskSize,
            @RequestParam(value = "genres", required = false) List<String> genreStrings) {  // Accept the image file

        List<Long> genreIds = genreStrings != null
                ? genreStrings.stream().map(Long::parseLong).collect(Collectors.toList())
                : Collections.emptyList();

        GameDTO gameDto = new GameDTO();
        gameDto.setTitle(title);
        gameDto.setDescription(description);
        gameDto.setPrice(price);
        gameDto.setDiskSize(diskSize);
        gameDto.setGenreIds(genreIds);

        return gameService.gameInsertion(gameDto);
    }

    @PutMapping("/{id}")
    public GameDTO updateGame(@PathVariable Long id, @RequestBody GameDTO gameDto) {
        gameDto.setGameId(id);
        return gameService.gameUpdate(gameDto);
    }

    @DeleteMapping("/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.gameDeletion(id);
    }

    @PostMapping("/buy/{gameId}")
    public String buyGame(@PathVariable Long gameId, @RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        return gameService.buyGame(gameId, username);
    }
}
