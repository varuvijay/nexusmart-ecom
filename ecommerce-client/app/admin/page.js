"use client";
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api/axios';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/mainComponents/admin/Sidebar';
import DashboardOverview from '@/components/mainComponents/admin/DashboardOverview';
import ProductsApproval from '@/components/mainComponents/admin/ProductsApproval';
import OrdersManagement from '@/components/mainComponents/admin/OrdersManagement';
import LoadingSpinner from '@/components/mainComponents/admin/LoadingSpinner';
import { getProducts, updateStatus } from '@/lib/api/admin';
import { useToast } from '../context/ToastContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalMerchants: 0,
    totalCustomers: 0,
    pendingProducts: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('token');
    console.log(token);
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // These would be your actual API endpoints
        // const statsResponse = await axiosInstance.get('/admin/stats');
        const productsResponse = await getProducts()
        // const ordersResponse = await axiosInstance.get('/admin/orders');
console.log(productsResponse.data.message);

        // setStats(statsResponse.data);
        setProducts(productsResponse.data.message);
        // setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleProductAction = async (productId, action) => {
    try {
     const response = await updateStatus(productId,action);
      // Update products list after action
      console.log(response.data);
      
      showToast({
        title: `Product ${action}`,
        description: `Product has been ${action.toLowerCase()} successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setProducts(products.filter(product => product.id !== productId));
      // Update stats
      setStats({
        ...stats,
        pendingProducts: stats.pendingProducts - 1
      });
    } catch (error) {
      console.error(`Error ${action} product:`, error);
      showToast({
        title: 'Error',
        description: `Failed to ${action.toLowerCase()} product`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await axiosInstance.put(`/admin/orders/${orderId}/status`, { status });
      // Update order status in the UI
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-4 md:p-8 w-full">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardOverview stats={stats} />
            )}

            {activeTab === 'products' && (
              <ProductsApproval 
                products={products} 
                handleProductAction={handleProductAction} 
              />
            )}

            {activeTab === 'orders' && (
              <OrdersManagement 
                orders={orders} 
                handleOrderStatusUpdate={handleOrderStatusUpdate} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}