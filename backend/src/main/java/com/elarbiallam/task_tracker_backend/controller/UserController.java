package com.elarbiallam.task_tracker_backend.controller;

import com.elarbiallam.task_tracker_backend.dto.user.UserDTO;
import com.elarbiallam.task_tracker_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/users/me : Récupérer mon profil
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getCurrentUserProfile(userDetails.getUsername()));
    }

    // PATCH /api/users/me : Mettre à jour mon profil
    @PatchMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(
            @RequestBody UserDTO userDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(userService.updateUserProfile(userDetails.getUsername(), userDTO));
    }
}