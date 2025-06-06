package com.ecommerce.repository;

import com.ecommerce.entity.Otp;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {

    @Transactional
    void deleteByEndtimeBefore(LocalDateTime twentyMinutesAgo);

    boolean existsByOtpAndEmailAndEndtimeGreaterThanEqual(
            Integer otp,
            String email,
            LocalDateTime now
    );

    Optional<Otp> findByEmail(String email);
}
