"use client"
import React, { useState, useEffect } from 'react';
import { useToast } from '@/app/context/ToastContext';
import axiosInstance from '@/lib/api/axios';
import { useRouter } from 'next/navigation';
import { log } from 'react-modal/lib/helpers/ariaAppHider';

/**
 * CartPage component displays user's cart items with product details and order management.
 * 
 * @component
 * @description Handles:
 * - Fetching cart items from backend
 * - Displaying product details and order item details
 * - Quantity updates
 * - Item removal
 * - Cart total calculations
 * - Checkout navigation
 * 
 * @returns {React.ReactElement} Complete cart page with items and controls
 */
const CartPage = () => {
  const { showToast } = useToast();
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [razorpay, setRazorpay] = useState(null);

  // Fetch cart data from backend
  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/customer/cart');
      const data = response.data;
      console.log(data );
      
      
      if (data.success) {
        setCartItems(data.products || []);
      } else {
        showToast({
          title: 'Error!',
          description: 'Failed to fetch cart items',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      
      if (error.response?.status === 401) {
        showToast({
          title: 'Login Required',
          description: 'Please login to view your cart',
          type: 'error'
        });
        router.push('/login');
      } else {
        showToast({
          title: 'Network Error',
          description: 'Failed to load cart. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (orderItemId, newQuantity, productName) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      const response = await axiosInstance.put(`/customer/cartUpdate/${orderItemId}?quantity=${newQuantity}`);
      
      if (response.data.success) {
        // Update local state
        console.log(response.data);
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === orderItemId
              ? { ...item, quantity: newQuantity, price: response.data.order_details.price }
              : item
          )
        );
        
        showToast({
          title: 'Updated!',
          description: `${productName} quantity updated`,
          type: 'success'
        });
      } else {
        showToast({
          title: 'Error!',
          description: 'Failed to update quantity',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update quantity',
        type: 'error'
      });
    } finally {
      setUpdating(false);
    }
  };

  // Remove item from cart
  const removeItem = async (orderItemId, productName) => {
    setRemovingItems(prev => new Set(prev).add(orderItemId));
    
    try {
      const response = await axiosInstance.delete(`/customer/removeCartItem/${orderItemId}`);
      console.log(response.data);
      if (response.data.success) {
        // Remove from local state
        setCartItems(prevItems =>
          prevItems.filter(item => item.id !== orderItemId)
        );
        
        showToast({
          title: 'Removed!',
          description: `${productName} removed from cart`,
          type: 'success'
        });
      } else {
        showToast({
          title: 'Error!',
          description: 'Failed to remove item',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showToast({
        title: 'Remove Failed',
        description: 'Failed to remove item from cart',
        type: 'error'
      });
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderItemId);
        return newSet;
      });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    setUpdating(true);
    try {
      const response = await axiosInstance.delete('/customer/cart/clear');
      
      if (response.data.success) {
        setCartItems([]);
        showToast({
          title: 'Cart Cleared!',
          description: 'All items removed from cart',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      showToast({
        title: 'Clear Failed',
        description: 'Failed to clear cart',
        type: 'error'
      });
    } finally {
      setUpdating(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  };

 const handlePayment = async (total, id) => {
  try {
    console.log(total, id);
    const response = await axiosInstance.get(`/customer/payment/${id}/${total}`);
    console.log(response.data);
     const order_id =response.data.order_details.id
     console.log(order_id);
    // Initialize Razorpay payment
    const options = {
      "key": response.data.order_details.key,
      "amount": Math.round(parseFloat(total)), // Convert to paise
      "currency": "INR",
      "name": "NexuSmart",
      "description": "Order Payment",
      "image": "/logo.png",
      "order_id": response.data.order_details.order_id,
      "handler": async function (response){
        console.log(response);
        setRazorpay(response);
        try {
          const res = await axiosInstance.post(`/customer/payment/${order_id}?razorpay_payment_id=${response.razorpay_payment_id}`);
                                 
          console.log(res.data);
          router.push(`/products/cart/orderSummery?orderId=${order_id}`);                         
        } catch (error) {
          console.error('Error processing payment:', error);
        }
      },
      "prefill": {
        "name": "Customer Name",
        "email": "customer@example.com",
        "contact": "9000090000"
      },
      "notes": {
        "cart_id": id
      },
      "theme": {
        "color": "#000000"
      }
    };
    console.log(options);
    
    const rzp1 = new window.Razorpay(options);
    console.log(rzp1);
    
    rzp1.on('payment.failed', function (response) {
      showToast({
        title: 'Payment Failed',
        description: response.error.description,
        type: 'error'
      });

    });

    rzp1.open();
    
  } catch (error) {
    console.error('Error processing payment:', error);
    showToast({
      title: 'Payment Error',
      description: 'Failed to process payment',
      type: 'error'
    });
  }
};

  

  // Initial load
  useEffect(() => {
    fetchCartData();
  }, []);

  const { subtotal, tax, shipping, total } = calculateTotals();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0L4 5M7 13h10m0 0l1.5 6M17 13l1.5 6" />
              </svg>
            </div>
            <h2 className="text-3xl font-light mb-4 tracking-wide">YOUR CART IS EMPTY</h2>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wide mb-4">SHOPPING CART</h1>
          <div className="w-24 h-px bg-black"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              
              {/* Cart Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2 className="text-xl font-light tracking-wide">
                  ITEMS ({cartItems.length})
                </h2>
                <button
                  onClick={clearCart}
                  disabled={updating}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                >
                  CLEAR CART
                </button>
              </div>

              {/* Cart Items List */}
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 border border-gray-100 hover:border-gray-200 transition-colors duration-300">
                  
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/logo.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="w-8 h-8 border border-black rotate-45"></div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-light tracking-wide">{item.product?.name}</h3>
                      <button
                        onClick={() => removeItem(item.id, item.product?.name)}
                        disabled={removingItems.has(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                      >
                        {removingItems.has(item.id) ? (
                          <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {item.product?.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Category: {item.product?.category}</p>
                        <p>Stock: {item.product?.stock}</p>
                        {item.product?.status !== 'active' && (
                          <p className="text-red-600">Status: {item.product?.status}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-light">${item.price}</p>
                        <p className="text-sm text-gray-500">per item</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.product?.name)}
                          disabled={updating || item.quantity <= 1}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-l border-r border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.product?.name)}
                          disabled={updating || item.quantity >= item.product?.stock}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-light">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">total</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-8">
              <h3 className="text-xl font-light tracking-wide mb-6">ORDER SUMMARY</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600">
                    🎉 Free shipping on orders over $50!
                  </p>
                )}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => handlePayment(total.toFixed(2),cartItems[0].cart.id)}
                  disabled={updating || cartItems.length === 0}
                  className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  PROCEED TO CHECKOUT
                </button>
                
                <button
                  onClick={() => router.push('/products')}
                  className="w-full border-2 border-black text-black py-4 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition-all duration-300"
                >
                  CONTINUE SHOPPING
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Secure checkout
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Multiple payment options
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Easy returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed or Recommended Products */}
        <div className="mt-16 hidden pt-12 border-t border-gray-200">
          <h3 className="text-2xl font-light tracking-wide mb-8">YOU MIGHT ALSO LIKE</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Placeholder for recommended products */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-square bg-gray-100 mb-3 group-hover:bg-gray-200 transition-colors duration-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 border border-gray-400 rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
                  </div>
                </div>
                <h4 className="text-sm font-light tracking-wide">Recommended Product {item}</h4>
                <p className="text-sm text-gray-600">$99.99</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;