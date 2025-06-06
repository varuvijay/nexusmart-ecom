package com.ecommerce.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserDto {

    @Size(min = 3, max = 20, message = "Name must be between 3 and 20 characters")
    private String name;

    @NotEmpty(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(
            regexp = "^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
            message = "* Password should contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
    )
    private String password;

    @Pattern(
            regexp = "^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
            message = "* Password should contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
    )
    private String confirmPassword;

    @AssertTrue(message = "Check terms and conditions in order to proceed")
    private boolean terms;
}
