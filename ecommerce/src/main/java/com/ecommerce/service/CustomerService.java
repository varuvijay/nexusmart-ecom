package com.ecommerce.service;


import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.OrderItem;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Map;

public interface CustomerService {

    Map<String, String> customerRegister(@Valid UserDto userDto, BindingResult result);

    Map<String, String> addCart(String sessionID, Long productId);


    List<OrderItem> getCart(String sessionID);

    Object createPayment(Long id, Double total, String sessionID);

    void confirmPament(Long id, String paymentId, String sessionId);

    Object setOrderSummery(String sessionID, Long orderId);

    Object updateCartQuantity(Long orderItemId, Integer quantity, String sessionID);

    Map<String, String> removeCartItem(Long orderItemId, String sessionID);

    Map<String, String> clearCart(String sessionID);
}
