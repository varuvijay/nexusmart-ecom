package com.ecommerce.entity;

import com.ecommerce.dto.UserDto;
import com.ecommerce.helper.AES;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @CreationTimestamp
    private LocalDateTime createdTime;

    public Merchant(UserDto userDto) {
        this.name = userDto.getName();
        this.email = userDto.getEmail();
        this.password= AES.encrypt(userDto.getPassword());
    }

    public Merchant() {

    }
}
