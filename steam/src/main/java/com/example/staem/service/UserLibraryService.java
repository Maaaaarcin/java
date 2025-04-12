package com.example.staem.service;

import com.example.staem.dto.UserLibraryDTO;
import com.example.staem.model.Game;
import com.example.staem.model.User;
import com.example.staem.model.UserLibrary;
import com.example.staem.repo.GameGenreRepo;
import com.example.staem.repo.GameRepo;
import com.example.staem.repo.UserLibraryRepo;
import com.example.staem.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserLibraryService {

    private final UserLibraryRepo libraryRepo;
    private final UserRepo userRepo;
    private final GameRepo gameRepo;
    private final GameGenreRepo gameGenreRepo;

    public List<UserLibraryDTO> getLibrary(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found."));

        return libraryRepo.findByUser(Optional.of(user)).stream()
                .map(this::mapper)
                .collect(Collectors.toList());
    }

    public void ReturnGame(String username, long gameId) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found."));
        Game game = gameRepo.findById(gameId)
                .orElseThrow(() -> new UsernameNotFoundException("Game not found."));

        user.setCoins(user.getCoins() + game.getPrice());
        userRepo.save(user);

        libraryRepo.deleteByUserAndGame(user, game);
    }

    public UserLibraryDTO mapper(UserLibrary userLibrary) {
        Game game = userLibrary.getGame();

        List<String> genreNames = gameGenreRepo.findByGameId(game)
                .stream()
                .map(gg -> gg.getGenreId().getGenreName())
                .collect(Collectors.toList());

        return new UserLibraryDTO(
                userLibrary.getUserLibraryId(),
                userLibrary.getUser().getUsername(),
                game.getGameId(),
                game.getTitle(),
                game.getDescription(),
                game.getDiskSize(),
                game.getPrice(),
                genreNames
        );
    }
}
