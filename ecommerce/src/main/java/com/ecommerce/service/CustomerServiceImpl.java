package com.ecommerce.service;

import com.ecommerce.dto.OrderStatus;
import com.ecommerce.dto.PaymentStatus;
import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.*;
import com.ecommerce.exception.InvalidOperationException;
import com.ecommerce.exception.LoginException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.SignUpException;
import com.ecommerce.helper.RazorPayHelper;
import com.ecommerce.helper.SessionCheck;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
class CustomerServiceImpl implements CustomerService {
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final OrderItemRepository orderItemRepository;
    private final SessionRepository sessionRepository;
    private final AdminRepository adminRepository;
    private final MerchantRepository merchantRepository;
    private final SessionCheck sessionCheck;
    private  final RazorPayHelper razorPayHelper;
    private final OrdersReposotory orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razor-pay.api.key}")
    String key;

    @Override
    public Map<String, String> customerRegister(UserDto userDto, BindingResult result) {
        if (!userDto.getPassword().equals(userDto.getConfirmPassword()))
            throw new SignUpException("Passwords do not match");
        if (customerRepository.existsByEmail(userDto.getEmail()) ||
                merchantRepository.existsByEmail(userDto.getEmail()) ||
                adminRepository.existsByEmail(userDto.getEmail()))
            throw new SignUpException("Email already exists");

        if (result.hasErrors())
            throw new SignUpException("Invalid data");

        customerRepository.save(new Customer(userDto));

        return Map.of("message", "account has been created");
    }

    @Override
    public Map<String, String> addCart(String sessionID, Long productId) {
        Session session = validateSession(sessionID);
        Product product = findAndValidateProduct(productId);
        Cart cart = getOrCreateCart(session.getEmail());
        
        return addProductToCart(cart, product);
    }

    @Override
    public List<OrderItem> getCart(String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Optional<Cart> cart = cartRepository.getCartByCustomer_Email(email);
        if(cart.isPresent())
            return orderItemRepository.findByCart(cart.get());
        else throw new ResourceNotFoundException("Cart not found");
    }

    @Override
    public Object createPayment(Long id, Double total, String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Customer customer = customerRepository.findByEmail(email);
        List<OrderItem> item = orderItemRepository.findByCart((Cart) cartRepository.findByCustomer_Email(email));
        Orders order = new Orders();
        String orderId;
        if (item.isEmpty())
            throw new InvalidOperationException("Cart is empty");
        else {
            orderId = razorPayHelper.createPayment((int) (total*100));

            order.setCustomer(customer);
            order.setOrderStatus(OrderStatus.PLACED);
            order.setPaymentStatus(PaymentStatus.PENDING);
            order.setTotalAmount(total);
            orderRepository.save(order);
        }

        return Map.of("order_id", orderId,
                "id", order.getId() ,
                "key",key,
                "session", sessionID) ;
    }

    @Override
    public void confirmPament(Long id, String paymentId, String sessionId) {
        String email = sessionCheck.getEmailOfUser(sessionId);
        Customer customer = customerRepository.findByEmail(email);
        Optional<Orders> order = orderRepository.findById(id);
        if(order.isPresent()){
            order.get().setPaymentStatus(PaymentStatus.PAID);
        }
        else
            order.get().setPaymentStatus(PaymentStatus.FAILED);

        orderRepository.save(order.get());
        Payment payment = new Payment();
        payment.setAmount(order.get().getTotalAmount());
        payment.setOrders(order.get());
        payment.setPaymentId(paymentId);
        payment.setPaymentStatus(PaymentStatus.PAID);
        paymentRepository.save(payment);

        Optional<Cart> cart = cartRepository.findByCustomer(customer);
        List<OrderItem> items = orderItemRepository.findByCart(cart.get());
        for (OrderItem item : items) {
            item.setCart(null);
            item.setOrders(order.get());
            orderItemRepository.save(item);
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

    }

    @Override
    public Object setOrderSummery(String sessionID, Long orderId) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Payment payment = paymentRepository.findByOrders_Id(orderId);
        if(payment != null){
            return payment ;
        }
        else
            throw new ResourceNotFoundException("Order not found");
    }

    @Override
    public Object updateCartQuantity(Long orderItemId, Integer quantity, String sessionID) {
        sessionCheck.getEmailOfUser(sessionID);

        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

        Product product = orderItem.getProduct();
        if (product.getStock() < quantity) {
            throw new InvalidOperationException("Requested quantity exceeds available stock");
        }

        orderItem.setQuantity(quantity);
        orderItemRepository.save(orderItem);
    
        return orderItem;
    }

    @Override
    public Map<String, String> removeCartItem(Long orderItemId, String sessionID) {
        sessionCheck.getEmailOfUser(sessionID);
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
        orderItemRepository.delete(orderItem);
        return Map.of("message", "Item removed from cart successfully",
                "success", "true");
    }
    @Override
    public Map<String, String> clearCart(String sessionID) {
        String email = sessionCheck.getEmailOfUser(sessionID);
        Cart cart = (Cart) cartRepository.findByCustomer_Email(email);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart not found");
        }
        List<OrderItem> items = orderItemRepository.findByCart(cart);
        orderItemRepository.deleteAll(items);
        return Map.of("message", "Cart cleared successfully",
                "success", "true");
    }


    private Session validateSession(String sessionID) {
        return sessionRepository.findBySessionId(sessionID)
                .filter(s -> customerRepository.existsByEmail(s.getEmail()))
                .orElseThrow(() -> new LoginException("Invalid session. Please login first"));
    }

    private Product findAndValidateProduct(Long productId) {
        System.err.println(productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (product.getStock() <= 0) {
            throw new InvalidOperationException("Product is out of stock");
        }
        return product;
    }

    private Cart getOrCreateCart(String customerEmail) {
        Customer customer = customerRepository.findByEmail(customerEmail);
        return cartRepository.findByCustomer(customer)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setCustomer(customer);
                    return cartRepository.save(newCart);
                });
    }

    private Map<String, String> addProductToCart(Cart cart, Product product) {
        List<OrderItem> cartItems = orderItemRepository.findByCart(cart);
        
        // Try to find existing item in cart
        Optional<OrderItem> existingItem = cartItems.stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        return existingItem.map(orderItem -> updateExistingCartItem(orderItem, product)).orElseGet(() -> addNewCartItem(cart, product));
    }

    private Map<String, String> updateExistingCartItem(OrderItem item, Product product) {
        if (product.getStock() > item.getQuantity()) {
            item.setQuantity(item.getQuantity() + 1);
            orderItemRepository.save(item);
            return Map.of("message", 
                String.format("%s quantity increased in cart", product.getName()));
        } else {
            throw new InvalidOperationException(
                String.format("%s is already in cart and out of stock", product.getName()));
        }
    }

    private Map<String, String> addNewCartItem(Cart cart, Product product) {
        OrderItem newItem = new OrderItem();
        newItem.setQuantity(1);
        newItem.setPrice(product.getPrice());
        newItem.setProduct(product);
        newItem.setCart(cart);
        orderItemRepository.save(newItem);
        
        return Map.of("message", 
            String.format("%s added to cart successfully", product.getName()));
    }
}