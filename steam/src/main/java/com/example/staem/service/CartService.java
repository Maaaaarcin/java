package com.example.staem.service;

import com.example.staem.dto.GameDTO;
import com.example.staem.model.Cart;
import com.example.staem.model.Game;
import com.example.staem.model.GameGenre;
import com.example.staem.model.User;
import com.example.staem.repo.CartRepo;
import com.example.staem.repo.GameGenreRepo;
import com.example.staem.repo.GameRepo;
import com.example.staem.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final UserRepo userRepo;
    private final GameRepo gameRepo;
    private final CartRepo cartRepo;
    private final GameGenreRepo gameGenreRepo;

    public String addToCart(Long userId, Long gameId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepo.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));

        if (cartRepo.existsByUserIdAndGameId(user, game)) {
            return "Game is already in cart";
        }

        Cart cart = new Cart();
        cart.setUserId(user);
        cart.setGameId(game);
        cartRepo.save(cart);
        return "Game added to cart";
    }

    public String removeFromCart(Long userId, Long gameId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepo.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));

        Cart cart = cartRepo.findByUserIdAndGameId(user, game)
                .orElseThrow(() -> new RuntimeException("Game not in cart"));

        cartRepo.delete(cart);
        return "Game removed from cart";
    }

    public List<GameDTO> viewCart(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Cart> cartItems = cartRepo.findByUserId(user);

        return cartItems.stream()
                .map(c -> {
                    List<GameGenre> genres = gameGenreRepo.findByGameId(c.getGameId());
                    return new GameDTO(c.getGameId(), genres);
                }).collect(Collectors.toList());
    }

}
