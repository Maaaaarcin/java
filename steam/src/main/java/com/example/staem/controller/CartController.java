package com.example.staem.controller;

import com.example.staem.dto.GameDTO;
import com.example.staem.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/{userId}/add/{gameId}")
    public ResponseEntity<String> addToCart(@PathVariable Long userId, @PathVariable Long gameId) {
        return ResponseEntity.ok(cartService.addToCart(userId, gameId));
    }

    @DeleteMapping("/{userId}/remove/{gameId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long userId, @PathVariable Long gameId) {
        return ResponseEntity.ok(cartService.removeFromCart(userId, gameId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<GameDTO>> viewCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.viewCart(userId));
    }
}
