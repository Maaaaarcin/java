package com.example.staem.repo;

import com.example.staem.model.Cart;
import com.example.staem.model.Game;
import com.example.staem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart, Long> {
    boolean existsByUserIdAndGameId(User userId, Game gameId);
    Optional<Cart> findByUserIdAndGameId(User userId, Game gameId);
    List<Cart> findByUserId(User userId);
}
