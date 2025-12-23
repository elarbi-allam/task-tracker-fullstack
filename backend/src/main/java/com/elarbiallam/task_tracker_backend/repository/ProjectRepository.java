package com.elarbiallam.task_tracker_backend.repository;

import com.elarbiallam.task_tracker_backend.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByUserId(Long userId, Pageable pageable);
}