package com.ecommerce.service;


import com.ecommerce.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface MerchantService {
    Map<String, String> merchantRegister(@Valid UserDto userDto, BindingResult result);

    Map<String, Object> addProducts(String productDtoJsonString, MultipartFile imageFile, String sessionID);

    Map<String, Object> getProducts(String sessionID);

    Map<String, Object> editProducts(String productDtoJsonString, MultipartFile imageFile, String sessionID, Long id);

    Map<String, Object> deleteProduct(Long id, String sessionID);
}
