package com.example.staem.repo;

import com.example.staem.model.UserLibrary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLibraryRepo extends JpaRepository<UserLibrary, Long> {
}
