package com.ecommerce.repository;

import com.ecommerce.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrders_Id(Long ordersId);
}
