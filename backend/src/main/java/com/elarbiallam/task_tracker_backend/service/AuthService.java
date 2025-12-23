package com.elarbiallam.task_tracker_backend.service;

import com.elarbiallam.task_tracker_backend.dto.auth.AuthResponse;
import com.elarbiallam.task_tracker_backend.dto.auth.LoginRequest;
import com.elarbiallam.task_tracker_backend.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
