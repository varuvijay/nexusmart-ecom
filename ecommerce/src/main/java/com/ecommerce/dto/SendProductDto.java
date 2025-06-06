package com.ecommerce.dto;

import com.ecommerce.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class SendProductDto {

    private Long id;

    private String name;

    private String description;

    private Double price;

    private Integer stock;

    private String imageUrl;

    private String category;

    private Status status = Status.PENDING;

    private LocalDateTime createdAt;


    public SendProductDto(Product productEntity) { // Or pass individual fields
        this.id = productEntity.getId();
        this.name = productEntity.getName();
        this.category = productEntity.getCategory();
        this.createdAt = productEntity.getCreatedAt(); // Handle potential null and formatting
        this.description = productEntity.getDescription();
        this.imageUrl = productEntity.getImageUrl();
        this.price = productEntity.getPrice();
        this.status = productEntity.getStatus() ; // If status is an enum
        this.stock = productEntity.getStock();
    }
}
