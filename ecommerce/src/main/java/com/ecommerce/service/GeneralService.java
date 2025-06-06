package com.ecommerce.service;

import com.ecommerce.dto.LoginDto;
import com.ecommerce.dto.OtpDto;
import com.ecommerce.entity.Product;
import jakarta.servlet.http.HttpSession;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface GeneralService {

    Map<String, String> otp(OtpDto otpDto);

    Map<String, String> verifyOtp(Integer otp, OtpDto otpDto);

    Map<String, String> userLogin(LoginDto loginDto, HttpSession session);

    Map<String, String> userLogout(String sessionID, HttpSession sessions);

    Page<Product> getProducts(String category, String sort, Long pageNO, Long limit, String sessionID);
}
