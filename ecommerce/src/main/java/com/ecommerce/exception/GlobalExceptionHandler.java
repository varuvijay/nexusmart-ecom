package com.ecommerce.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(SignUpException.class)
    public ResponseEntity<Map<String, String>> handleUserExistException(SignUpException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<Map<String, String>> handleUserExistException(LoginException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }



}
