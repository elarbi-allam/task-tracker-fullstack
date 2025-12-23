package com.elarbiallam.task_tracker_backend.dto.task;

import com.elarbiallam.task_tracker_backend.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private LocalDate dueDate;

    private TaskStatus status; // PENDING, IN_PROGRESS, COMPLETED

    private Long projectId; // Important pour savoir à quel projet lier la tâche
}