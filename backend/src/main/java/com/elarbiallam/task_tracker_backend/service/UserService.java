package com.elarbiallam.task_tracker_backend.service;

import com.elarbiallam.task_tracker_backend.dto.user.UserDTO;

public interface UserService {
    UserDTO getCurrentUserProfile(String email);
    UserDTO updateUserProfile(String email, UserDTO userDTO);
}