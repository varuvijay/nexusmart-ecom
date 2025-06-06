package com.ecommerce.controller;

import com.ecommerce.dto.ProductDto; // Assuming this might be used indirectly or was planned
import com.ecommerce.dto.UserDto;
// import com.ecommerce.exception.SignUpException; // Not explicitly used in this controller, consider removing if truly unused
import com.ecommerce.service.MerchantService;
// import com.fasterxml.jackson.core.JsonProcessingException; // Not explicitly used, ObjectMapper handles this
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
// import org.springframework.validation.BeanPropertyBindingResult; // Not explicitly used
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator; // Assuming this is used, though not directly in the methods shown
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// import java.util.HashMap; // Not explicitly used, Map interface is sufficient
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/merchant")
public class MerchantController {

    private final MerchantService merchantService;
    private final ObjectMapper objectMapper; // Kept as it might be used internally by the framework or for other purposes
    private final Validator validator;       // Kept as it's injected

    @Autowired
    public MerchantController(
            MerchantService merchantService,
            ObjectMapper objectMapper,
            @Qualifier("defaultValidator") Validator validator
    ) {
        this.merchantService = merchantService;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerMerchant(
            @Valid @RequestBody UserDto userDto,
            BindingResult result
    ) {
        Map<String, String> responseBody = merchantService.merchantRegister(userDto, result);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(responseBody);
    }

    @PostMapping(value = "/addProducts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> addProducts(
            @RequestParam("productDtoJson") String productDtoJsonString,
            @RequestParam(name = "imageFile", required = false) MultipartFile imageFile,
            @RequestHeader("sessionID") String sessionID
    ) {
        Map<String, Object> responseBody = merchantService.addProducts(productDtoJsonString, imageFile, sessionID);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(responseBody);
    }

    @GetMapping("/getProducts")
    public ResponseEntity<Map<String, Object>> getProducts(@RequestHeader("sessionID") String sessionID) {
        Map<String, Object> responseBody = merchantService.getProducts(sessionID);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseBody);
    }

    @PutMapping(value = "/editProducts/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> editProducts(
            @PathVariable Long id,
            @RequestParam("productDtoJson") String productDtoJsonString,
            @RequestParam(name = "imageFile", required = false) MultipartFile imageFile,
            @RequestHeader("sessionID") String sessionID
    ) {
        Map<String, Object> responseBody = merchantService.editProducts(productDtoJsonString, imageFile, sessionID, id);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseBody);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(
            @PathVariable Long id,
            @RequestHeader("sessionID") String sessionID
    ) {
        Map<String, Object> responseBody = merchantService.deleteProduct(id, sessionID);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responseBody);
    }


}