package com.example.staem.service;

import com.example.staem.model.Genre;
import com.example.staem.repo.GenreRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepo genreRepo;

    public List<Genre> genreList() {
        return genreRepo.findAll();
    }

    public void genreDeletion(Long genreId) {
        genreRepo.deleteById(genreId);
    }

    public Genre genreUpdate(Genre genreUpdated) {
        Genre genre = new Genre();
        genre.setGenreName(genreUpdated.getGenreName());

        return genreRepo.save(genre);
    }

    public Genre genreInsertion(Genre genre) {
        return genreRepo.save(genre);
    }
}
