package com.ecommerce.repository;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByCart(Cart cart);
}
