package com.ecommerce.service;

import com.ecommerce.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.util.Map;

public interface AdminService {


    Map<String, String> reqisterUser(@Valid UserDto userDto, BindingResult result);

    Map<String, Object> fetchProducts(String sessionID);

    Map<String, String> handleProductAction(Long productId, String action, String sessionID);
}
