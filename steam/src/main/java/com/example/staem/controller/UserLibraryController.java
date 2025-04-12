package com.example.staem.controller;

import com.example.staem.dto.UserLibraryDTO;
import com.example.staem.model.UserLibrary;
import com.example.staem.service.UserLibraryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/library")
public class UserLibraryController {

    private final UserLibraryService libraryService;

    @GetMapping("/{username}")
    public List<UserLibraryDTO> getUserLibrary(@PathVariable String username) {
        return libraryService.getLibrary(username);
    }

    @Transactional
    @DeleteMapping("/{username}/{gameId}")
    public void ReturnGame(@PathVariable String username, @PathVariable long gameId) {
        libraryService.ReturnGame(username, gameId);
    }
}
