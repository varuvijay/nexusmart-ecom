package com.ecommerce.service;

import com.ecommerce.dto.Status;
import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.Admin;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.SignUpException;
import com.ecommerce.helper.SessionCheck;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.MerchantRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    SessionCheck sessionCheck;

    @Autowired
    ProductRepository productRepository;


    @Override
    public Map<String, String> reqisterUser(UserDto userDto, BindingResult result) {
        if (!userDto.getPassword().equals(userDto.getConfirmPassword()))
            throw new SignUpException("Passwords do not match");
        if (customerRepository.existsByEmail(userDto.getEmail()) ||
                merchantRepository.existsByEmail(userDto.getEmail()) ||
                adminRepository.existsByEmail(userDto.getEmail()))
            throw new SignUpException("Email already exists");

        if (result.hasErrors())
            throw new SignUpException("Invalid data");

        adminRepository.save(new Admin(userDto));


        return Map.of("message", "account has been created");
    }

    @Override
    public Map<String, Object> fetchProducts(String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        List<Product> products = productRepository.findAll();
        return Map.of("message",products);
    }

    @Override
    public Map<String, String> handleProductAction(Long productId, String action, String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Optional<Product> product = productRepository.findById(productId);
        System.err.println(action);
        if(product.isPresent()){
            if (action.equals("APPROVED")) product.get().setStatus(Status.APPROVED);
            if (action.equals("REJECTED")) product.get().setStatus(Status.REJECTED);
        productRepository.save(product.get());
        }
        return Map.of("message","The status has been updated");
    }
}
