package com.ecommerce.entity;

import com.ecommerce.dto.LoginDto;
import jakarta.persistence.*;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String sessionId;

    @Email
    @Column(nullable = false)
    private String email;

    @CreationTimestamp
    private LocalDateTime created_at;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    public Session(LoginDto loginDto, HttpSession sessions) {
        this.sessionId = sessions.getId();
        this.email = loginDto.getEmail();
        this.status = SessionStatus.active;
    }

    public Session() {

    }
}
