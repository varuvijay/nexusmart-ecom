package com.ecommerce.controller;


import com.ecommerce.dto.UserDto;
import com.ecommerce.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@CrossOrigin
@RequestMapping("/admin")
@RestController
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody @Valid UserDto userDto , BindingResult result) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminService.reqisterUser(userDto,result));
    }
    @GetMapping("/getProducts")
    public ResponseEntity<Map<String, Object>> fetchProducts( @RequestHeader("sessionID") String sessionID ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminService.fetchProducts(sessionID));
    }

    @PostMapping("/products/{productId}/{action}")
    public ResponseEntity<Map<String, String>> handleProductAction(
            @PathVariable Long productId,
            @PathVariable String action,
            @RequestHeader("sessionID") String sessionID) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(adminService.handleProductAction(productId, action, sessionID));
    }
}