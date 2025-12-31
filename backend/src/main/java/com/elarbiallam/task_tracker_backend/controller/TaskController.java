package com.elarbiallam.task_tracker_backend.controller;

import com.elarbiallam.task_tracker_backend.dto.task.TaskDTO;
import com.elarbiallam.task_tracker_backend.enums.TaskStatus;
import com.elarbiallam.task_tracker_backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/project/{projectId}")
    public ResponseEntity<TaskDTO> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskDTO taskDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(taskService.createTask(projectId, taskDTO, userDetails.getUsername()));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Page<TaskDTO>> getTasksByProject(
            @PathVariable Long projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") String sortTitle,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId, status, page, size, userDetails.getUsername(), sortTitle));
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskDTO taskDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(taskService.updateTask(taskId, taskDTO, userDetails.getUsername()));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        taskService.deleteTask(taskId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}