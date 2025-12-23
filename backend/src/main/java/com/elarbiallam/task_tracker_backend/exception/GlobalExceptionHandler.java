package com.elarbiallam.task_tracker_backend.exception;

import io.jsonwebtoken.security.SignatureException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Erreur de Validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return buildResponse(HttpStatus.BAD_REQUEST, errorMessage);
    }

    // 2. Erreur Login
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials() {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
    }

    // 3. Token Invalide
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ErrorResponse> handleSignatureException() {
        return buildResponse(HttpStatus.FORBIDDEN, "Session invalide, veuillez vous reconnecter");
    }

    // 4. Utilisateur non trouvé (Auth)
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UsernameNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 5. Entité non trouvée (Projet, Tâche...) -> C'est ICI que ça corrige ton erreur 500
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 6. Conflit
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleIntegrityViolation() {
        return buildResponse(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
    }

    // 7. Accès refusé
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied() {
        return buildResponse(HttpStatus.FORBIDDEN, "Vous n'avez pas la permission de faire ça");
    }

    // 8. Fallback général
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        ex.printStackTrace();
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Une erreur inattendue est survenue");
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
        ErrorResponse response = ErrorResponse.builder()
                .status(status.value())
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build();
        return new ResponseEntity<>(response, status);
    }
}