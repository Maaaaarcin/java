package com.example.staem.service;

import com.example.staem.dto.RoleDTO;
import com.example.staem.model.Role;
import com.example.staem.repo.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepo roleRepo;

    public List<RoleDTO> getAllRoles() {
        return roleRepo.findAll().stream()
                .map(role -> new RoleDTO(role.getRoleId(), role.getRoleName()))
                .collect(Collectors.toList());
    }

    public RoleDTO getRoleById(Long roleId) {
        Role role = roleRepo.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return new RoleDTO(role.getRoleId(), role.getRoleName());
    }
}