package com.elarbiallam.task_tracker_backend.dto.project;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private LocalDateTime createdAt;

    // Champs calculés pour le Dashboard
    private int totalTasks;
    private int completedTasks;
    private double progressPercentage;
}