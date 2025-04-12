package com.example.staem.controller;

import com.example.staem.model.Genre;
import com.example.staem.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping("/genres")
    public List<Genre> genreList() {
        return genreService.genreList();
    }

    @Transactional
    @DeleteMapping("/genre")
    public void genreDeletion(@RequestParam Long genreId) {
        genreService.genreDeletion(genreId);
    }

    @PatchMapping("/genre")
    public Genre genreUpdate(@RequestBody Genre genre) {
        return genreService.genreUpdate(genre);
    }

    @PostMapping("/genre")
    public Genre genreInsertion(@RequestBody Genre genre) {
        return genreService.genreInsertion(genre);
    }
}
