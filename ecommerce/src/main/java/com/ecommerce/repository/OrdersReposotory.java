package com.ecommerce.repository;

import com.ecommerce.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrdersReposotory extends JpaRepository<Orders, Long> {
    Optional<Orders> findByCustomer_Email(String customerEmail);
}
