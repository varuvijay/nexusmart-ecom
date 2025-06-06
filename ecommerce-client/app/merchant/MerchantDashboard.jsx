"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import components
import Header from '@/components/mainComponents/merchant/Header';
import Sidebar from '@/components/mainComponents/merchant/Sidebar';
import ProfileTab from '@/components/mainComponents/merchant/ProfileTab';
import ProductForm from '@/components/mainComponents/merchant/ProductForm';
import ApprovalsTab from '@/components/mainComponents/merchant/ApprovalsTab';
import EarningsTab from '@/components/mainComponents/merchant/EarningsTab';
import ClientOnly from '@/components/custom/ClientOnly';
import ProductsTab from '@/components/mainComponents/merchant/ProductsTab ';
import { addProducts, deleteProduct, editProducts, getProducts } from '@/lib/api/merchant'
// import second from '@/app/context/toast'
import { useToast } from '../context/ToastContext';
import { get } from 'react-hook-form';


const MerchantDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [merchantProfile, setMerchantProfile] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [edit, setEdit] = useState(false);
  const [earningsData, setEarningsData] = useState({
    totalRevenue: 0,
    currentMonth: 0,
    monthlyChange: 0,
    totalOrders: 0,
    months: [],
    revenue: [],
    topProducts: [],
    recentTransactions: []
  });

  const { showToast } = useToast();


  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call to fetch merchant data
    setTimeout(() => {
      setMerchantProfile({
        id: '123',
        name: 'Fashion Store',
        email: 'store@example.com',
        joinedDate: '2023-01-15',
        address: '123 Market St, San Francisco, CA',
        phone: '+1 (555) 123-4567'
      });

      // Fetch products using the imported getProducts function
      (async () => {
        try {
          const response = await getProducts();
          console.log(response.data);
          const formattedProducts = response.data.products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
            category: product.category,
            status: product.status.toLowerCase(), // PENDING, APPROVED, REJECTED, etc.
            createdAt: product.createdAt
          }));

          // console.table(formattedProducts);

          setProducts(formattedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      })();

      // Mock earnings data
      setEarningsData({
        totalRevenue: 12589.75,
        currentMonth: 2450.30,
        monthlyChange: 12.5,
        totalOrders: 156,
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [1200, 1350, 1100, 1500, 1800, 2100, 1950, 2300, 2450, 2200, 2600, 2450],
        topProducts: [
          { name: 'Premium T-Shirt', sales: 3200 },
          { name: 'Designer Jeans', sales: 2800 },
          { name: 'Casual Hoodie', sales: 2100 },
          { name: 'Summer Dress', sales: 1800 },
          { name: 'Leather Jacket', sales: 1500 }
        ],
        recentTransactions: [
          { id: '1001', date: '2023-10-15', amount: 89.99, status: 'completed' },
          { id: '1002', date: '2023-10-14', amount: 149.97, status: 'completed' },
          { id: '1003', date: '2023-10-13', amount: 29.99, status: 'processing' },
          { id: '1004', date: '2023-10-12', amount: 59.99, status: 'completed' },
          { id: '1005', date: '2023-10-11', amount: 89.99, status: 'completed' },
          { id: '1006', date: '2023-10-10', amount: 29.99, status: 'cancelled' },
          { id: '1007', date: '2023-10-09', amount: 149.97, status: 'completed' },
          { id: '1008', date: '2023-10-08', amount: 49.99, status: 'processing' }
        ]
      });

      setIsLoading(false);
    }, 1000);
  }, []);



  // Product management handlers
  const handleAddProduct = async (productDataFromForm) => {
    console.log('Adding product (data from form):', productDataFromForm);

    const formData = new FormData();

    const productDetails = {
      name: productDataFromForm.name,
      price: productDataFromForm.price,
      description: productDataFromForm.description,
      stock: productDataFromForm.stock,
      category: productDataFromForm.category,
    };
    formData.append('productDtoJson', JSON.stringify(productDetails));

    if (productDataFromForm.image && productDataFromForm.image instanceof File) {
      formData.append('imageFile', productDataFromForm.image, productDataFromForm.image.name);
    }

    console.table('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      let response;
      if (edit) {
        response = await editProducts(formData, editingProduct.id);
        setEdit(false);
        console.table(response.data);
      } else {
        response = await addProducts(formData);
        console.table(response.data);
      }

      showToast({
        title: edit ? 'Product Updated' : 'Product Added',
        description: edit ? 'Product updated successfully' : 'Product added successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh products list after successful add/edit
      const updatedProducts = await getProducts();
      const formattedProducts = updatedProducts.data.products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        category: product.category,
        status: product.status.toLowerCase(),
        createdAt: product.createdAt
      }));
      setProducts(formattedProducts);

    } catch (error) {
      console.error(error);
      showToast({
        title: 'Error',
        description: edit ? 'Failed to update product' : 'Failed to add product',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setShowAddProductModal(false);
    setEditingProduct(null);
    setEdit(false);
  };

  const handleEditProduct = (product) => {
    setEdit(true);
    setEditingProduct(product);
    console.table(product);
    setShowAddProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    
    try {
      console.log("this is working");
      
      const response = await deleteProduct(productId);
      console.log(response.data);
      showToast({
        title: 'Product Deleted',
        description: 'Product deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: 'Error',
        description: 'Failed to delete product',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
    }

    console.log('Deleting product:', productId);
    setProducts(products.filter(p => p.id !== productId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50">
        {/* <Header merchantProfile={merchantProfile} handleLogout={handleLogout} /> */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <Sidebar
              merchantProfile={merchantProfile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              products={products}
            />
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Products Tab */}
              {activeTab === 'products' && (
                <ProductsTab
                  products={products}
                  handleEditProduct={handleEditProduct}
                  handleDeleteProduct={handleDeleteProduct}
                  setEditingProduct={setEditingProduct}
                  setShowAddProductModal={setShowAddProductModal}
                />
              )}

              {/* Earnings Tab */}
              {activeTab === 'earnings' && earningsData && (
                <EarningsTab earningsData={earningsData} />
              )}

              {/* Approval Status Tab */}
              {activeTab === 'approvals' && (
                <ApprovalsTab
                  products={products}
                  handleEditProduct={handleEditProduct}
                />
              )}

              {/* Profile Settings Tab */}
              {activeTab === 'profile' && (
                <ProfileTab merchantProfile={merchantProfile} />
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {showAddProductModal && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleAddProduct}
            onCancel={() => {
              setShowAddProductModal(false);
              setEditingProduct(null);
            }}
            edit={edit}
          />
        )}
      </div>
    </ClientOnly>
  );
};

export default MerchantDashboard;