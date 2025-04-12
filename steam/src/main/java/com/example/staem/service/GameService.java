package com.example.staem.service;

import com.example.staem.dto.GameDTO;
import com.example.staem.model.*;
import com.example.staem.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepo gameRepo;
    private final UserRepo userRepo;
    private final UserLibraryRepo userLibraryRepo;
    private final GenreRepo genreRepo;
    private final GameGenreRepo gameGenreRepo;

    // Change the method name in the GameService class to match the controller
    public List<GameDTO> getFilteredGames(String username, String query, Double minPrice, Double maxPrice, List<Long> genreIds) {
        if (username == null) {
            return gameRepo.findAll().stream()
                    .filter(game -> filterByPrice(game, minPrice, maxPrice))
                    .filter(game -> filterByQuery(game, query))
                    .filter(game -> filterByGenres(game, genreIds))
                    .map(game -> {
                        List<GameGenre> gameGenres = gameGenreRepo.findByGameId(game);
                        return new GameDTO(game, gameGenres);
                    })
                    .collect(Collectors.toList());
        }

        Optional<User> user = userRepo.findByUsername(username);
        if (user.isEmpty()) {
            return Collections.emptyList(); // or throw an exception depending on the use case
        }

        List<Long> ownedGameIds = userLibraryRepo.findByUser(user).stream()
                .map(userLibrary -> userLibrary.getGame().getGameId())
                .toList();

        return gameRepo.findAll().stream()
                .filter(game -> !ownedGameIds.contains(game.getGameId()))
                .filter(game -> filterByPrice(game, minPrice, maxPrice))
                .filter(game -> filterByQuery(game, query))
                .filter(game -> filterByGenres(game, genreIds))
                .map(game -> {
                    List<GameGenre> gameGenres = gameGenreRepo.findByGameId(game);
                    return new GameDTO(game, gameGenres);
                })
                .collect(Collectors.toList());
    }

    private boolean filterByPrice(Game game, Double minPrice, Double maxPrice) {
        return game.getPrice() >= minPrice && game.getPrice() <= maxPrice;
    }

    private boolean filterByQuery(Game game, String query) {
        if (query == null || query.isEmpty()) {
            return true;
        }
        return game.getTitle().toLowerCase().contains(query.toLowerCase());
    }

    private boolean filterByGenres(Game game, List<Long> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            return true;
        }
        List<Genre> gameGenreIds = gameGenreRepo.findByGameId(game).stream()
                .map(GameGenre::getGenreId)
                .collect(Collectors.toList());
        return !Collections.disjoint(gameGenreIds, genreIds);
    }

    public Optional<GameDTO> gameData(Long gameId) {
        return gameRepo.findById(gameId).map(game -> {
            List<GameGenre> gameGenres = gameGenreRepo.findByGameId(game);
            return new GameDTO(game, gameGenres);
        });
    }

    public void gameDeletion(Long gameId) {
        gameRepo.deleteById(gameId);
    }

    public GameDTO gameUpdate(GameDTO gameDto) {
        // 1. Find the game entity
        Game game = gameRepo.findById(gameDto.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // 2. Update game properties
        if (gameDto.getTitle() != null) {
            game.setTitle(gameDto.getTitle());
        }
        if (gameDto.getDescription() != null) {
            game.setDescription(gameDto.getDescription());
        }
        if (gameDto.getPrice() != null) {
            game.setPrice(gameDto.getPrice());
        }
        if (gameDto.getDiskSize() != null) {
            game.setDiskSize(gameDto.getDiskSize());
        }

        // 3. Save the updated game first
        game = gameRepo.save(game);

        // 4. Clear existing game-genre relationships
        List<GameGenre> existingMappings = gameGenreRepo.findByGameId(game);
        gameGenreRepo.deleteAll(existingMappings);

        // 5. Find the genres to associate with the game
        List<Genre> genres = new ArrayList<>();

        // Handle genreIds if provided
        if (gameDto.getGenreIds() != null && !gameDto.getGenreIds().isEmpty()) {
            genres = genreRepo.findAllById(gameDto.getGenreIds());
        }
        // Handle genres if provided by name
        else if (gameDto.getGenres() != null && !gameDto.getGenres().isEmpty()) {
            genres = genreRepo.findAll().stream()
                    .filter(g -> gameDto.getGenres().contains(g.getGenreName()))
                    .collect(Collectors.toList());
        }

        if (genres.isEmpty() && (gameDto.getGenres() != null || gameDto.getGenreIds() != null)) {
            throw new RuntimeException("No valid genres found for game.");
        }

        // 6. Create new game-genre associations
        List<GameGenre> newGameGenres = new ArrayList<>();
        for (Genre genre : genres) {
            GameGenre gg = new GameGenre();
            gg.setGameId(game);  // Set the managed Game entity
            gg.setGenreId(genre); // Set the Genre
            newGameGenres.add(gameGenreRepo.save(gg));
        }

        // 7. Return the updated game with its genres
        return new GameDTO(game, newGameGenres);
    }

    public GameDTO gameInsertion(GameDTO gameDto) {
        Game game = new Game();
        game.setTitle(gameDto.getTitle());
        game.setDescription(gameDto.getDescription());
        game.setPrice(gameDto.getPrice());
        game.setDiskSize(gameDto.getDiskSize());

        // Save the game first
        Game savedGame = gameRepo.save(game);
        System.out.println(gameDto);

        // Retrieve the genres from the database using the genre IDs
        List<Genre> genres = genreRepo.findAll().stream()
                .filter(g -> gameDto.getGenreIds().contains(g.getGenreId()))  // Use genreIds instead of genres
                .toList();

        if (genres.isEmpty()) {
            throw new RuntimeException("No valid genres found for game.");
        }

        // Create a GameGenre association for each valid genre
        for (Genre genre : genres) {
            GameGenre gg = new GameGenre();
            gg.setGameId(savedGame);
            gg.setGenreId(genre);
            gameGenreRepo.save(gg);
        }

        // Fetch the GameGenres for the saved game
        List<GameGenre> gameGenres = gameGenreRepo.findByGameId(savedGame);

        // Return the GameDTO with the saved game and its associated genres
        return new GameDTO(savedGame, gameGenres);
    }

    public String buyGame(Long gameId, String username) {
        Game game = gameRepo.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if(userLibraryRepo.existsByUserUserIdAndGameGameId(user.getUserId(), gameId)) {
            return "You already have this game";
        }

        if (user.getCoins() >= game.getPrice()) {
            user.setCoins(user.getCoins() - game.getPrice());
            userRepo.save(user);

            UserLibrary userLibrary = new UserLibrary();
            userLibrary.setUser(user);
            userLibrary.setGame(game);
            userLibrary.setPurchaseDate(LocalDateTime.now());
            userLibraryRepo.save(userLibrary);

            return "Game purchased successfully!";
        } else {
            return "Insufficient coins to purchase the game.";
        }
    }
}
