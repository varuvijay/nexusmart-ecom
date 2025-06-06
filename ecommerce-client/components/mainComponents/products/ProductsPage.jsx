"use client"
import React, { useState, useEffect } from 'react';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import axiosInstance from '@/lib/api/axios';
import { useToast } from '@/app/context/ToastContext';

/**
 * ProductsPage component renders a dynamic product listing page with server-side filtering and pagination.
 * 
 * @component
 * @description Main container for product listing that handles:
 * - Server-side product fetching
 * - Category and sort parameter management
 * - Pagination state
 * - Loading states
 * 
 * @returns {React.ReactElement} A fully interactive product listing page
 */
const ProductsPage = () => {

    const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsPerPage] = useState(12);

  // Fetch products from backend
  const fetchProducts = async (category = 'all', sort = 'name-asc', page = 0) => {
    setLoading(true);
    try {
      const params = {
        category: category !== 'all' ? category : 'all',
        sort,
        page : page - 1,
        limit: productsPerPage
      };
      console.log(params);
      

      const response = await axiosInstance.get('/getProducts', { params });
      const data = response.data;
      console.log(data);
      
      if (data.success) {
        console.log("working");
        
        setProducts(data.products);
        setFilteredProducts(data.products.content);
        setTotalPages(data.products.totalPages);
        setTotalProducts(data.products.totalElements);
        setCurrentPage(data.products.number+1);
        
        // Success notification
        // showToast({
        //   title: 'Success!',
        //   description: 'Products loaded successfully',
        //   type: 'success'
        // });
      } else {
        showToast({
          title: 'Error!',
          description: 'Something went wrong',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast({
        title: 'Network Error',
        description: error.response?.data?.message || 'Failed to load products. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts(selectedCategory, sortBy, currentPage);
  }, []);

  // Handle category change
  const handleCategoryChange = async (category) => {
    try {
      setSelectedCategory(category);
      setCurrentPage(1); // Reset to first page
      await fetchProducts(category, sortBy, 1);
    } catch (error) {
      showToast('Failed to filter products', 'error');
    }
  };

  // Handle sort change
  const handleSortChange = async (sort) => {
    try {
      setSortBy(sort);
      setCurrentPage(1); // Reset to first page
      await fetchProducts(selectedCategory, sort, 1);
    } catch (error) {
      showToast('Failed to sort products', 'error');
    }
  };

  // Handle page change
  const handlePageChange = async (page) => {
    try {
      setCurrentPage(page);
      await fetchProducts(selectedCategory, sortBy, page);
    } catch (error) {
      showToast('Failed to load page', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Filters and Controls */}
        <ProductFilters
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          viewMode={viewMode}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onViewModeChange={setViewMode}
          loading={loading}
        />

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8 text-sm text-gray-600">
          <p>
            Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
          </p>
          {selectedCategory !== 'all' && (
            <p>Filtered by: {selectedCategory.toUpperCase()}</p>
          )}
        </div>

        {/* Products Grid/List */}
        <ProductGrid
          products={filteredProducts}
          viewMode={viewMode}
          loading={loading}
          onClearFilters={() => {
            setSelectedCategory('all');
            setSortBy('name');
            setCurrentPage(1);
            fetchProducts('all', 'name', 1);
          }}
        />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
