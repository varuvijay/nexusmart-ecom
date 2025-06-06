package com.ecommerce.entity;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.Status;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private String imageUrl;

    private String category;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    private Merchant merchant;

    public Product(ProductDto productDto, String imageUrl, Optional<Merchant> merchant) {
        this.name = productDto.getName();
        this.description = productDto.getDescription();
        this.price = productDto.getPrice();
        this.imageUrl = imageUrl;
        this.category = productDto.getCategory();
        this.stock = productDto.getStock();
        this.merchant = merchant.orElse(null);
    }

    public Product() {

    }


    public Product(ProductDto productDto, Merchant merchant, Product product) {
        this.name = productDto.getName();
        this.description = productDto.getDescription();
        this.price = productDto.getPrice();
        this.imageUrl = product.getImageUrl();
        this.category = productDto.getCategory();
        this.stock = productDto.getStock();
        this.merchant = merchant;
        this.status = product.getStatus();
        this.createdAt = product.getCreatedAt();
        this.id = product.getId();
    }
}
