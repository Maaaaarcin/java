package com.example.staem.repo;

import com.example.staem.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepo extends JpaRepository<Genre, Long> {
//    Optional<Genre> findByGenreName(String genreName);

    List<Genre> findByGenreName(String genreName);
}
