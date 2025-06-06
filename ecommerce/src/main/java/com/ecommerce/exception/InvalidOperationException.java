package com.ecommerce.exception;

public class InvalidOperationException  extends RuntimeException  {
    public InvalidOperationException(String productIsOutOfStock) {
        super(productIsOutOfStock);
    }
}
