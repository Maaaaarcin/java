package com.example.staem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserLibraryDTO {
    private Long userLibraryId;
    private String username;
    private Long gameId;
    private String title;
    private String description;
    private Double diskSize;
    private Double price;
    private List<String> genres;
}
