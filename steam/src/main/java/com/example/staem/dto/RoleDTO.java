package com.example.staem.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class RoleDTO implements Serializable {
    private Long roleId;
    private String roleName;

    public RoleDTO(Long roleId, String roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }
}