package com.ecommerce.service;

import com.ecommerce.dto.LoginDto;
import com.ecommerce.dto.OtpDto;
import com.ecommerce.dto.Status;
import com.ecommerce.entity.*;
import com.ecommerce.exception.LoginException;
import com.ecommerce.exception.SignUpException;
import com.ecommerce.helper.AES;
import com.ecommerce.helper.EmailSender;
import com.ecommerce.helper.SessionCheck;
import com.ecommerce.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class GeneralServiceImpl implements GeneralService {

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private SessionCheck sessionCheck;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public Map<String, String> otp(OtpDto otpDto) {
        Integer otp = new Random().nextInt(100000, 1000000);

        Otp entity = otpRepository
                .findByEmail(otpDto.getEmail())
                .orElseGet(() -> new Otp(otpDto.getEmail()));

        // Uncomment if OTP limit logic is needed
        // if (entity.getOtpLimit() != null || entity.getOtpLimit().isAfter(LocalDateTime.now())) {
        //     throw new SignUpException("You have reached the limit of otp");
        // }

        if (entity.getCount() >= 20) {
            entity.onOtpLimit();
            otpRepository.save(entity);
            throw new SignUpException("You have reached the maximum number of attempts");
        }

        entity.setCount(entity.getCount());
        entity.setOtp(otp);
        emailSender.sendEmail(otp, otpDto);
        otpRepository.save(entity);

        return Map.of("message", "Otp has been sent to your email");
    }

    @Override
    public Map<String, String> verifyOtp(Integer otp, OtpDto otpDto) {
        boolean isValid = otpRepository.existsByOtpAndEmailAndEndtimeGreaterThanEqual(
                otp, otpDto.getEmail(), LocalDateTime.now()
        );

        if (isValid) {
            return Map.of(
                    "message", "Otp verified successfully",
                    "otpVerification", "true"
            );
        } else {
            throw new SignUpException("Otp is not valid");
        }
    }

    @Override
    public Map<String, String> userLogin(LoginDto loginDto, HttpSession sessions) {
        System.err.println(loginDto);
        Admin admin = adminRepository.findByEmail(loginDto.getEmail());
        Optional<Merchant> merchant = merchantRepository.findByEmail(loginDto.getEmail());
        Customer customer = customerRepository.findByEmail(loginDto.getEmail());
        if (admin == null && merchant.isEmpty() && customer == null) {
            throw new LoginException("Invalid email or password");
        }

        if (admin != null) {
            if (Objects.equals(AES.decrypt(admin.getPassword()), loginDto.getPassword())) {
                return loginResponse(sessions, "admin", loginDto, admin.getName());
            } else {
                throw new LoginException("Invalid password");
            }
        }

        if (merchant.isPresent()) {
            System.out.println(AES.decrypt(merchant.get().getPassword()));
            if (Objects.equals(AES.decrypt(merchant.get().getPassword()), loginDto.getPassword())) {
                return loginResponse(sessions, "merchant", loginDto, merchant.get().getName());
            } else {
                throw new LoginException("Invalid password");
            }
        }

        if (Objects.equals(AES.decrypt(customer.getPassword()), loginDto.getPassword())) {
            return loginResponse(sessions, "customer", loginDto, customer.getName());
        } else {
            throw new LoginException("Invalid password");
        }

    }

    @Override
    public Map<String, String> userLogout(String sessionID, HttpSession sessions) {
        sessionRepository.findBySessionId(sessionID)
                .ifPresentOrElse(session -> {
                    if (!session.getStatus().equals(SessionStatus.invalidated)) {
                        sessions.invalidate();
                        session.setStatus(SessionStatus.invalidated);
                        sessionRepository.save(session);
                    }else {throw new LoginException("Session is invalidated");}
        },() -> {
            throw new LoginException("Session not found");
        });
        return Map.of("message","Logout sucessfull");
    }

    @Override
    public Page<Product> getProducts(String category, String sort, Long pageNO, Long limit, String sessionID) {
//        String email = sessionCheck.getEmailOfUser(sessionID);
        Pageable pageable ;
        String[] sortArr = sort.split("-");
        if(sortArr[1].equals("asc"))
         pageable = PageRequest.of(pageNO.intValue(), limit.intValue(),Sort.by(sortArr[0]).ascending());
        else pageable = PageRequest.of(pageNO.intValue(), limit.intValue(),Sort.by(sortArr[0]).descending());
        Page<Product> products ;
        if(category.equals("all")) {
            products = productRepository.findByStatus(Status.APPROVED, pageable);
        } else if (category.equals("electronics") ||
                category.equals("clothing") ||
                category.equals("home-kitchen") ||
                category.equals("books") ||
                category.equals("beauty-personal-care") ||
                category.equals("toys-games") ||
                category.equals("sports-outdoors") ||
                category.equals("health-wellness") ||
                category.equals("jewelry") ||
                category.equals("automotive") ||
                category.equals("other")) {
            products = productRepository.findByCategoryAndStatus(category, Status.APPROVED, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }
        return products ;
    }

    private Map<String, String> loginResponse(HttpSession sessions, String role, LoginDto loginDto, String name) {
        sessionRepository.save(new Session(loginDto, sessions));
        return Map.of(
                "message", "Your account has been logged in",
                "session", sessions.getId(),
                "role", role,
                "email", loginDto.getEmail(),
                "name",name
        );
    }
}
