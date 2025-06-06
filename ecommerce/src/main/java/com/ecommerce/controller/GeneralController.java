package com.ecommerce.controller;

import com.ecommerce.dto.LoginDto;
import com.ecommerce.dto.OtpDto;
import com.ecommerce.entity.Product;
import com.ecommerce.service.GeneralService;
import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class GeneralController {

    @Autowired
    GeneralService generalService;

    @PostMapping("/otp")
    public ResponseEntity<Map<String, String>> otp(@RequestBody OtpDto otpDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(generalService.otp(otpDto));
    }

    @PostMapping("/verifyOtp/{otp}")
    public ResponseEntity<Map<String, String>> otpverification(@PathVariable Integer otp, @RequestBody OtpDto otpDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(generalService.verifyOtp(otp, otpDto));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> userLogin(@RequestBody LoginDto loginDto, HttpSession session) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(generalService.userLogin(loginDto, session));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> userLogout(@RequestHeader("sessionID") String sessionID,
                                                          HttpSession sessions) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(generalService.userLogout(sessionID, sessions));
    }

    @GetMapping("/getProducts")
    public ResponseEntity<Map<String, Object>> getProducts(@RequestHeader(required = false) String sessionID ,
                                                           @RequestParam(defaultValue = "all") String category,
                                                           @RequestParam(defaultValue = "asc") String sort,
                                                           @RequestParam(defaultValue = "1") Long page ,
                                                           @RequestParam(defaultValue = "12") Long limit
    ) {
       Page<Product> products = generalService.getProducts(category,sort,page,limit,sessionID);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Products fetched successfully",
                        "products", products,
                        "success","true"));
    }
}
