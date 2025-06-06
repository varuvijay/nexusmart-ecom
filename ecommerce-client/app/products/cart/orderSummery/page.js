"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useToast } from '@/app/context/ToastContext';
import axiosInstance from '@/lib/api/axios';
import { useRouter, useSearchParams } from 'next/navigation';

const OrderSummaryContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { showToast } = useToast();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        showToast({
          title: 'Error!',
          description: 'No order ID provided',
          type: 'error'
        });
        router.push('/products');
        return;
      }

      try {
        const response = await axiosInstance.get(`/customer/orderSummery/${orderId}`);
        if (response.data.success === "true") {
          setOrderDetails(response.data.products);
        } else {
          showToast({
            title: 'Error!',
            description: 'Failed to fetch order details',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        showToast({
          title: 'Error!',
          description: 'Failed to load order details',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-light mb-4">Order Not Found</h2>
          <button
            onClick={() => router.push('/products')}
            className="bg-black text-white px-6 py-2 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const isSuccess = orderDetails.paymentStatus === 'PAID';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className={`w-16 h-16 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full mx-auto mb-4 flex items-center justify-center`}>
            {isSuccess ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="text-4xl font-light tracking-wide mb-2">
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
          <p className="text-gray-600">
            {isSuccess ? 'Thank you for your purchase' : 'Please try again or contact support'}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-light mb-6">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">#{orderDetails.orders.id}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Order Date</span>
              <span>{new Date(orderDetails.createdTime).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Payment Status</span>
              <span className={`font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {orderDetails.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Order Status</span>
              <span className="font-medium">{orderDetails.orders.orderStatus}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Payment ID</span>
              <span className="font-medium">{orderDetails.paymentId}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium">${orderDetails.amount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/products')}
            className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300"
          >
            Continue Shopping
          </button>
          {isSuccess && (
            <button
              onClick={() => window.print()}
              className="border-2 border-black text-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition-all duration-300"
            >
              Print Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderSummary = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderSummaryContent />
    </Suspense>
  );
};

export default OrderSummary;
