package com.ecommerce.controller;

import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RequestMapping("/customer")
@RestController
public class CustomerController {


    @Autowired
    private CustomerService customerService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> otp(@RequestBody @Valid UserDto userDto, BindingResult result) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(customerService.customerRegister(userDto, result));
    }

    @PostMapping("/cart/{productId}")
    public ResponseEntity<Map<String, String>> cart(@PathVariable Long productId, @RequestHeader String sessionID) {
        System.err.println(sessionID + " " + productId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(customerService.addCart(sessionID, productId));
    }

    @GetMapping("/cart")
    public ResponseEntity<Map<String, Object>> getCart(@RequestHeader(required = false) String sessionID) {
        List<OrderItem> product = customerService.getCart(sessionID);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Products fetched successfully",
                        "products", product,
                        "success", "true"));
    }

    @PutMapping("/cartUpdate/{orderItemId}")
    public ResponseEntity<Map<String, Object>> updateQuantity(@PathVariable Long orderItemId,
                                                              @RequestHeader String sessionID,
                                                              @RequestParam Integer quantity) {
        Object order = customerService.updateCartQuantity(orderItemId, quantity, sessionID);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Cart updated successfully",
                        "order_details", order,
                        "success", "true"));
    }
    
    


    @GetMapping("/payment/{id}/{total}")
    public ResponseEntity<Map<String, Object>> paymenat(@PathVariable double total,
                                                        @RequestHeader String sessionID,
                                                        @PathVariable Long id) {
        Object order = customerService.createPayment(id, total, sessionID);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Products fetched successfully",
                        "order_details", order,
                        "success", "true"));
    }

    @PostMapping("/payment/{orderId}")
    public void confirmPayment(@PathVariable("orderId") Long id,
                                 @RequestParam("razorpay_payment_id") String paymentId,
                                 @RequestHeader("sessionID") String sessionId) {
         customerService.confirmPament(id, paymentId, sessionId);
    }

    @GetMapping("/orderSummery/{orderId}")
    public ResponseEntity<Map<String, Object>> orderSummery(@RequestHeader String sessionID,
                                                            @PathVariable Long orderId) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Products fetched successfully",
                        "products", customerService.setOrderSummery(sessionID,orderId),
                        "success", "true"));
    }


    @DeleteMapping("/removeCartItem/{orderItemId}")
    public ResponseEntity<Map<String, String>> removeCartItem(@PathVariable Long orderItemId,
                                                              @RequestHeader String sessionID) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(customerService.removeCartItem(orderItemId, sessionID));
    }

    @DeleteMapping("/cart/clear")
    public ResponseEntity<Map<String, String>> clearCart(@RequestHeader String sessionID) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(customerService.clearCart(sessionID));
    }


}