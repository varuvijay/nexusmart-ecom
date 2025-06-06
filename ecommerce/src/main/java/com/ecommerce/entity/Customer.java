package com.ecommerce.entity;

import com.ecommerce.dto.UserDto;
import com.ecommerce.helper.AES;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @CreationTimestamp
    private LocalDateTime createdTime;


    public Customer(UserDto userDto) {
        this.name = userDto.getName();
        this.email = userDto.getEmail();
        this.password= AES.encrypt(userDto.getPassword());
    }

    public Customer() {

    }
}
