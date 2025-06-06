package com.ecommerce.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;


@Data
public class ProductDto {


    @Size(min = 3, max = 50, message = "* Name should be 3~50 charecters")
    private String name;

    @Size(min = 15, max = 1000, message = "* Description should be 15~1000 charecters")
    private String description;

    private MultipartFile image;
    
    @Min(value = 100, message = "* Minimum Product Price should be 100")
    @Max(value = 1000000, message = "* Maximum Product Price allowed is 1,00,000")
    private double price;
    
    @Min(value = 1, message = "* Atleast 1 stock is required")
    @Max(value = 1000, message = "* At max 1000 stocks are available")
    private int stock;

    @NotEmpty(message = "* It is required")
    private String category;



}
