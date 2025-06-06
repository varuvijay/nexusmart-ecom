package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer count;

    @Column(nullable = false, unique = true)
    private Integer otp;

    @Column(nullable = false)
    private String email;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime createdTime;

    @Column(nullable = false, updatable = false)
    private LocalDateTime endtime;

    @Column(nullable = false)
    private LocalDateTime otpLimit ;

    public Otp(String email) {
        this.email = email;
        this.count = 0;
        this.otpLimit = LocalDateTime.now().minusMinutes(10);
    }

    public Otp() {
    }

    @PrePersist
    protected void onCreate() {
        this.endtime = LocalDateTime.now().plusMinutes(10);
    }

    public void setCount(Integer count) {
        if (count >= 3) {
            this.count = 0;
        } else {
            this.count = count + 1;
        }
    }

    public void onOtpLimit() {
        this.otpLimit=LocalDateTime.now().plusMinutes(30);
    }
}
