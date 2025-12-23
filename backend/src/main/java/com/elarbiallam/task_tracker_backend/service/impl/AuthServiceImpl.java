package com.elarbiallam.task_tracker_backend.service.impl;

import com.elarbiallam.task_tracker_backend.dto.auth.AuthResponse;
import com.elarbiallam.task_tracker_backend.dto.auth.LoginRequest;
import com.elarbiallam.task_tracker_backend.dto.auth.RegisterRequest;
import com.elarbiallam.task_tracker_backend.entity.User;
import com.elarbiallam.task_tracker_backend.repository.UserRepository;
import com.elarbiallam.task_tracker_backend.security.JwtUtils;
import com.elarbiallam.task_tracker_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Vérification si l'email existe déjà
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            // Lève une exception spécifique pour que le GlobalExceptionHandler renvoie 409 CONFLICT
            throw new DataIntegrityViolationException("Email is already in use");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        var jwtToken = jwtUtils.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Authentifie l'utilisateur via Spring Security
        // Si le mot de passe est faux, cette méthode lance automatiquement BadCredentialsException (401 UNAUTHORIZED)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Récupère l'utilisateur pour générer le token
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        var jwtToken = jwtUtils.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .build();
    }
}