package com.ecommerce.repository;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomer(Customer customer);
    
    Object findByCustomer_Email(String email);

    Optional<Cart> getCartByCustomer_Email(String email);

    Customer customer(Customer customer);
}
