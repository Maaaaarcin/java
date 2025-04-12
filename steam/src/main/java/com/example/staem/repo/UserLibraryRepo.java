package com.example.staem.repo;

import com.example.staem.model.Game;
import com.example.staem.model.User;
import com.example.staem.model.UserLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLibraryRepo extends JpaRepository<UserLibrary, Long> {
    boolean existsByUserUserIdAndGameGameId(Long userId, Long gameId);
    List<UserLibrary> findByUser(Optional<User> user);

    void deleteByUserAndGame(User user, Game gameId);
}
