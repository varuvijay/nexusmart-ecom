package com.ecommerce.entity;

import com.ecommerce.dto.UserDto;
import com.ecommerce.helper.AES;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;



    public Admin(UserDto userDto) {
        this.name = userDto.getName();
        this.email = userDto.getEmail();
        this.password= AES.encrypt(userDto.getPassword());
    }

    public Admin() {

    }
}
