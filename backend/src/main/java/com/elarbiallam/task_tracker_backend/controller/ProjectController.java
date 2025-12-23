package com.elarbiallam.task_tracker_backend.controller;

import com.elarbiallam.task_tracker_backend.dto.project.ProjectDTO;
import com.elarbiallam.task_tracker_backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(
            @Valid @RequestBody ProjectDTO projectDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(projectService.createProject(projectDTO, userDetails.getUsername()));
    }
    
    @GetMapping
    public ResponseEntity<Page<ProjectDTO>> getUserProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(projectService.getUserProjects(userDetails.getUsername(), page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(projectService.getProjectById(id, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDTO projectDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        projectService.deleteProject(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}