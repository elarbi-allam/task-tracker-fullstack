package com.elarbiallam.task_tracker_backend.service;

import com.elarbiallam.task_tracker_backend.dto.task.TaskDTO;
import com.elarbiallam.task_tracker_backend.enums.TaskStatus;
import org.springframework.data.domain.Page;

public interface TaskService {
    TaskDTO createTask(Long projectId, TaskDTO taskDTO, String userEmail);
    Page<TaskDTO> getTasksByProjectId(Long projectId, TaskStatus status, int page, int size, String userEmail);
    TaskDTO updateTask(Long taskId, TaskDTO taskDTO, String userEmail);
    void deleteTask(Long taskId, String userEmail);
}