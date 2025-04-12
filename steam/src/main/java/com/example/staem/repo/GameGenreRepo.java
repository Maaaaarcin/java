package com.example.staem.repo;

import com.example.staem.model.Game;
import com.example.staem.model.GameGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameGenreRepo extends JpaRepository<GameGenre, Long> {
    List<GameGenre> findByGameId(Game game);
}
