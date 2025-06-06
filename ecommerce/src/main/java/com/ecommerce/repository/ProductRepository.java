package com.ecommerce.repository;

import com.ecommerce.dto.Status;
import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    ArrayList<Product> findProductsByMerchant_Email(String email);


    Page<Product> findByStatus(Status status, Pageable pageable);

    Page<Product> findByCategoryAndStatus(String category, Status status, Pageable pageable);
}
