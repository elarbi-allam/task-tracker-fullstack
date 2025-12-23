package com.elarbiallam.task_tracker_backend.repository;

import com.elarbiallam.task_tracker_backend.entity.Task;
import com.elarbiallam.task_tracker_backend.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Récupérer toutes les tâches d'un projet avec pagination
    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    // Récupérer les tâches d'un projet FILTRÉES par statut avec pagination
    Page<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status, Pageable pageable);
}