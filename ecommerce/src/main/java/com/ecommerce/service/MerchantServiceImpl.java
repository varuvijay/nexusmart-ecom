package com.ecommerce.service;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.SendProductDto;
import com.ecommerce.dto.Status;
import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.Merchant;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.SignUpException;
import com.ecommerce.helper.CloudinaryHelper;
import com.ecommerce.helper.SessionCheck;
import com.ecommerce.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class MerchantServiceImpl implements MerchantService {

    private final CustomerRepository customerRepository;
    private final MerchantRepository merchantRepository;
    private final AdminRepository adminRepository;
    private final CloudinaryHelper cloudinaryHelper;
    private final ObjectMapper objectMapper;
    private final Validator validator;
    private final ProductRepository productRepository;
    private final SessionCheck sessionCheck;

    @Autowired
    public MerchantServiceImpl(
            CustomerRepository customerRepository,
            MerchantRepository merchantRepository,
            AdminRepository adminRepository,
            CloudinaryHelper cloudinaryHelper,
            ObjectMapper objectMapper,
            @Qualifier("defaultValidator") Validator validator,
            ProductRepository productRepository,
            SessionCheck sessionCheck) {
        this.customerRepository = customerRepository;
        this.merchantRepository = merchantRepository;
        this.adminRepository = adminRepository;
        this.cloudinaryHelper = cloudinaryHelper;
        this.objectMapper = objectMapper;
        this.validator = validator;
        this.productRepository = productRepository;
        this.sessionCheck = sessionCheck;
    }

    @Override
    public Map<String, String> merchantRegister(UserDto userDto, BindingResult result) {
        if (!userDto.getPassword().equals(userDto.getConfirmPassword())) {
            throw new SignUpException("Passwords do not match");
        }

        boolean emailExists = customerRepository.existsByEmail(userDto.getEmail()) ||
                merchantRepository.existsByEmail(userDto.getEmail()) ||
                adminRepository.existsByEmail(userDto.getEmail());

        if (emailExists) {
            throw new SignUpException("Email already exists");
        }

        if (result.hasErrors()) {
            throw new SignUpException("Invalid data");
        }

        merchantRepository.save(new Merchant(userDto));
        return Map.of("message", "account has been created");
    }

    @Override
    public Map<String, Object> addProducts(String productDtoJsonString, MultipartFile imageFile, String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Optional<Merchant> merchant = merchantRepository.findByEmail(email);
        ProductDto productDto;

        try {
            productDto = objectMapper.readValue(productDtoJsonString, ProductDto.class);
        } catch (JsonProcessingException e) {
            return Map.of(
                    "error", "Invalid product data format",
                    "details", e.getMessage()
            );
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            productDto.setImage(imageFile);
        }

        BindingResult result = new BeanPropertyBindingResult(productDto, "productDto");
        validator.validate(productDto, result);

        if (result.hasErrors()) {
            Map<String, Object> errors = new HashMap<>();
            errors.put("status", "error");

            Map<String, String> fieldErrors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    fieldErrors.put(error.getField(), error.getDefaultMessage())
            );

            errors.put("errors", fieldErrors);
            return errors;
        }

        String imageUrl = null;
        if (productDto.getImage() != null && !productDto.getImage().isEmpty()) {
            imageUrl = cloudinaryHelper.saveImage(productDto.getImage());
        }

        productRepository.save(new Product(productDto, imageUrl, merchant));
        return Map.of("message", "product has been added");
    }

    @Override
    public Map<String, Object> getProducts(String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        List<Product> productEntities = productRepository.findProductsByMerchant_Email(email);

        List<SendProductDto> productDtos = productEntities.stream()
                .map(SendProductDto::new)
                .toList();

        return Map.of(
                "message", "products fetched successfully",
                "products", productDtos
        );
    }

    @Override
    public Map<String, Object> editProducts(String productDtoJsonString, MultipartFile imageFile, String sessionID, Long id) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Optional<Merchant> merchant = merchantRepository.findByEmail(email);
        ProductDto productDto;

        try {
            productDto = objectMapper.readValue(productDtoJsonString, ProductDto.class);
        } catch (JsonProcessingException e) {
            return Map.of(
                    "error", "Invalid product data format",
                    "details", e.getMessage()
            );
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            productDto.setImage(imageFile);
        }

        System.err.println(productDto.toString());

        BindingResult result = new BeanPropertyBindingResult(productDto, "productDto");
        validator.validate(productDto, result);

        if (result.hasErrors()) {
            Map<String, Object> errors = new HashMap<>();
            errors.put("status", "error");

            Map<String, String> fieldErrors = new HashMap<>();
            result.getFieldErrors().forEach(error ->
                    fieldErrors.put(error.getField(), error.getDefaultMessage())
            );

            errors.put("errors", fieldErrors);
            return errors;
        }

        String imageUrl = null;
        if (productDto.getImage() != null && !productDto.getImage().isEmpty()) {
            imageUrl = cloudinaryHelper.saveImage(productDto.getImage());
        }

        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            product.get().setId(id);

            Product prod;
            if (productDto.getImage() != null) {
                prod = new Product(productDto, imageUrl, merchant);
                prod.setId(id);
                prod.setCreatedAt(product.get().getCreatedAt());
                prod.setStatus(Status.APPROVED);
            } else {
                prod = new Product(productDto, merchant.get(), product.get());
                prod.setStatus(Status.APPROVED);
            }

            productRepository.save(prod);
        }

        return Map.of("message", "product has been added");
    }

    @Override
    public Map<String, Object> deleteProduct(Long id, String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Optional<Merchant> merchant = merchantRepository.findByEmail(email);
        Optional<Product> product = productRepository.findById(id);

        if (product.isPresent()) {
            cloudinaryHelper.deleteImage(product.get().getImageUrl());
            productRepository.deleteById(id);
        }

        return Map.of("message", "product has been deleted");
    }
}
