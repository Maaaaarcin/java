package com.example.staem.service;

import com.example.staem.dto.GameDTO;
import com.example.staem.model.Game;
import com.example.staem.model.Genre;
import com.example.staem.model.User;
import com.example.staem.model.UserLibrary;
import com.example.staem.repo.GameRepo;
import com.example.staem.repo.GenreRepo;
import com.example.staem.repo.UserLibraryRepo;
import com.example.staem.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public List<GameDTO> gameList() {

        return gameRepo.findAll().stream()
                .map(GameDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<GameDTO> gameData(Long gameId) {
        return gameRepo.findById(gameId).map(GameDTO::new);
    }

    public void gameDeletion(Long gameId) {
        gameRepo.deleteById(gameId);
    }

    public GameDTO gameUpdate(Game gameUpdated) {

        Game game = gameRepo.findById(gameUpdated.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (gameUpdated.getTitle() != null) {
            game.setTitle(gameUpdated.getTitle());
        }
        if (gameUpdated.getDescription() != null) {
            game.setDescription(gameUpdated.getDescription());
        }
        if (gameUpdated.getPrice() != null) {
            game.setPrice(gameUpdated.getPrice());
        }
        if (gameUpdated.getDiskSize() != null) {
            game.setDiskSize(gameUpdated.getDiskSize());
        }

        game = gameRepo.save(game);


        return new GameDTO(game);
    }

    public GameDTO gameInsertion(GameDTO gameDto) {

        Game game = new Game();
        game.setTitle(gameDto.getTitle());
        game.setDescription(gameDto.getDescription());
        game.setPrice(gameDto.getPrice());
        game.setDiskSize(gameDto.getDiskSize());

        List<Genre> genres = genreRepo.findByGenreName(gameDto.getGenreName());

        if (genres.size() == 1) {
            game.setGenreName(genres.get(0));
        } else if (genres.size() > 1) {

            game.setGenreName(genres.get(0));
            System.out.println("Warning: Multiple genres with the same name found, picking the first one.");
        } else {

            throw new RuntimeException("Genre not found: " + gameDto.getGenreName());
        }


        Game savedGame = gameRepo.save(game);


        return new GameDTO(savedGame);
    }

    public String buyGame(Long userId, Long gameId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepo.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));

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
