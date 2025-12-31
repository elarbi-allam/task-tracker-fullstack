package com.elarbiallam.task_tracker_backend.service.impl;

import com.elarbiallam.task_tracker_backend.dto.task.TaskDTO;
import com.elarbiallam.task_tracker_backend.entity.Project;
import com.elarbiallam.task_tracker_backend.entity.Task;
import com.elarbiallam.task_tracker_backend.enums.TaskStatus;
import com.elarbiallam.task_tracker_backend.repository.ProjectRepository;
import com.elarbiallam.task_tracker_backend.repository.TaskRepository;
import com.elarbiallam.task_tracker_backend.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    @Override
    @Transactional
    public TaskDTO createTask(Long projectId, TaskDTO taskDTO, String userEmail) {
        Project project = getProjectCheckOwner(projectId, userEmail);

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(taskDTO.getDescription())
                .dueDate(taskDTO.getDueDate())
                .status(taskDTO.getStatus() != null ? taskDTO.getStatus() : TaskStatus.PENDING)
                .project(project)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToDTO(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskDTO> getTasksByProjectId(Long projectId, TaskStatus status, int page, int size, String userEmail, String sortTitle) {
        getProjectCheckOwner(projectId, userEmail); // Vérif sécurité

        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending()); // Tri par date d'échéance
        if(sortTitle.equals("sort")){
            pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        }



        Page<Task> taskPage;
        if (status != null) {
            // Si un statut est fourni, on filtre
            taskPage = taskRepository.findByProjectIdAndStatus(projectId, status, pageable);
        } else {
            // Sinon on renvoie tout
            taskPage = taskRepository.findByProjectId(projectId, pageable);
        }

        return taskPage.map(this::mapToDTO);
    }

    @Override
    @Transactional
    public TaskDTO updateTask(Long taskId, TaskDTO taskDTO, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        if (!task.getProject().getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You do not have permission to modify this task");
        }

        if (taskDTO.getTitle() != null) {
            task.setTitle(taskDTO.getTitle());
        }

        if (taskDTO.getDescription() != null) {
            task.setDescription(taskDTO.getDescription());
        }

        if (taskDTO.getDueDate() != null) {
            task.setDueDate(taskDTO.getDueDate());
        }

        if (taskDTO.getStatus() != null) {
            task.setStatus(taskDTO.getStatus());
        }

        Task updatedTask = taskRepository.save(task);
        return mapToDTO(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + taskId));

        if (!task.getProject().getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You do not have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    // --- Private Methods ---

    private Project getProjectCheckOwner(Long projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        if (!project.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You do not have permission to access this project");
        }
        return project;
    }

    private TaskDTO mapToDTO(Task task) {
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .projectId(task.getProject().getId())
                .build();
    }
}