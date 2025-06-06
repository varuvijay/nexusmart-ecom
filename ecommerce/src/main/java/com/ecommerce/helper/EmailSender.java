package com.ecommerce.helper;

import com.ecommerce.dto.OtpDto;
import com.ecommerce.repository.OtpRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;

@Component
public class EmailSender {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine engine;

    @Value("${spring.mail.username}")
    private String from;

    public void sendEmail(Integer otp, OtpDto otpDto) {
        Context context = new Context();
        context.setVariable("otp", otp);

        String text = engine.process("mail.html", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setFrom(from);
            helper.setTo(otpDto.getEmail());
            helper.setSubject("OTP Verification");
            helper.setText(text, true);
            System.err.println(otp);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Otp is not sent: " + otp);
        }
    }

    @Scheduled(fixedRate = 3600000)
    public void cleanExpiredOtp() {
        LocalDateTime twentyMinutesAgo = LocalDateTime.now().minusMinutes(20);
        otpRepository.deleteByEndtimeBefore(twentyMinutesAgo);
    }
}
