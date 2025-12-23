package com.elarbiallam.task_tracker_backend.service;

import com.elarbiallam.task_tracker_backend.dto.project.ProjectDTO;
import org.springframework.data.domain.Page;

public interface ProjectService {
    ProjectDTO createProject(ProjectDTO projectDTO, String userEmail);
    Page<ProjectDTO> getUserProjects(String userEmail, int page, int size);
    ProjectDTO getProjectById(Long projectId, String userEmail);
    ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO, String userEmail);
    void deleteProject(Long projectId, String userEmail);
}