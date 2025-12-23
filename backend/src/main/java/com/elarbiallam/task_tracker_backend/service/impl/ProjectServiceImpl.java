package com.elarbiallam.task_tracker_backend.service.impl;

import com.elarbiallam.task_tracker_backend.dto.project.ProjectDTO;
import com.elarbiallam.task_tracker_backend.entity.Project;
import com.elarbiallam.task_tracker_backend.entity.Task;
import com.elarbiallam.task_tracker_backend.entity.User;
import com.elarbiallam.task_tracker_backend.enums.TaskStatus;
import com.elarbiallam.task_tracker_backend.repository.ProjectRepository;
import com.elarbiallam.task_tracker_backend.repository.UserRepository;
import com.elarbiallam.task_tracker_backend.service.ProjectService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ProjectDTO createProject(ProjectDTO projectDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Project project = Project.builder()
                .title(projectDTO.getTitle())
                .description(projectDTO.getDescription())
                .user(user)
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToDTO(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectDTO> getUserProjects(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Création de l'objet Pageable (Tri par ID décroissant pour voir les derniers projets en premier)
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        // Récupération paginée et conversion en DTO
        return projectRepository.findByUserId(user.getId(), pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId, String userEmail) {
        Project project = getProjectEntityCheckOwner(projectId, userEmail);
        return mapToDTO(project);
    }

    @Override
    @Transactional
    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO, String userEmail) {
        Project project = getProjectEntityCheckOwner(projectId, userEmail);

        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());

        Project updatedProject = projectRepository.save(project);
        return mapToDTO(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId, String userEmail) {
        Project project = getProjectEntityCheckOwner(projectId, userEmail);
        projectRepository.delete(project);
    }

    // --- Private Methods ---

    private Project getProjectEntityCheckOwner(Long projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        if (!project.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You do not have permission to access this project");
        }
        return project;
    }

    private ProjectDTO mapToDTO(Project project) {
        List<Task> tasks = project.getTasks();
        int totalTasks = (tasks == null) ? 0 : tasks.size();

        int completedTasks = (tasks == null) ? 0 : (int) tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count();

        double progress = 0.0;
        if (totalTasks > 0) {
            progress = ((double) completedTasks / totalTasks) * 100;
        }

        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .createdAt(project.getCreatedAt())
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .progressPercentage(Math.round(progress * 100.0) / 100.0)
                .build();
    }
}