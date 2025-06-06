"use client"
import React from 'react';
import { useToast } from '@/app/context/ToastContext';
import axiosInstance from '@/lib/api/axios';

/**
 * ProductGrid component displays products in grid or list view with loading states.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of product objects
 * @param {string} props.viewMode - Display mode (grid/list)
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onClearFilters - Callback to clear all filters
 * @param {Function} props.onAddToCart - Optional callback after successful cart addition
 */
const ProductGrid = ({ products, viewMode, loading, onClearFilters, onAddToCart }) => {
    const { showToast } = useToast();

    // Add to cart function
    const handleAddToCart = async (productId,productName) => {
        try {
            console.log(productId);
            
            const response = await axiosInstance.post(`/customer/cart/${productId}`);
console.log(response.data);

                showToast({
                    title: 'Added to Cart!',
                    description: `${productName} has been added to your cart`,
                    type: 'success'
                });

                
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            
            // Handle different error scenarios
            if (error.response?.status === 401) {
                showToast({
                    title: 'Login Required',
                    description: 'Please login to add items to cart',
                    type: 'error'
                });
            } else if (error.response?.status === 400) {
                showToast({
                    title: 'Invalid Request',
                    description: error.response.data.message || 'Invalid product or quantity',
                    type: 'error'
                });
            } else {
                showToast({
                    title: 'Network Error',
                    description: 'Failed to add item to cart. Please try again.',
                    type: 'error'
                });
            }
        }
    };

    const ProductCard = ({ product }) => (
        <div className="drop-shadow-xl/50  group cursor-pointer animate-fade-in  pb-3 border-b-2 ">
            <div className="relative overflow-hidden bg-blue-50 aspect-square mb-4 animate-scale-105-hover  ">
                {/* Product Image */}
                <img 
                    src={product.imageUrl || "@/public/logo.png"} 
                    alt={product.name}
                    className="w-full hover:-z-20 h-full object-cover group-hover:scale-105 transition-transform duration-500 "
                    onError={(e) => {
                        e.target.src = "./logo.png";
                    }}
                />

                {/* Stock Status */}
                {product.stock === 0 && (
                    <div className="absolute  inset-0 bg-opacity-50 flex items-center justify-center backdrop-blur-md">
                        <span className="text-black text-sm font-medium tracking-wide">OUT OF STOCK</span>
                    </div>
                )}

                {/* Add to Cart Button */}
                { product.stock !== 0 && 
                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product.id || product._id, product.name);
                            }}
                            className="bg-white text-black px-6 py-2 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed z-50"
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                        </button>
                    </div>
                }
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-light tracking-wide group-hover:text-gray-600 transition-colors duration-200">
                    {product.name}
                </h3>
                {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <p className="text-xl font-light">${product.price}</p>
                    <div className="text-sm text-gray-500">
                        Stock: {product.stock}
                    </div>
                </div>
                {product.category && (
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {product.category}
                    </p>
                )}
            </div>
        </div>
    );

    // Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // No Products Found
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-2xl font-light mb-4">No products found</h3>
                <p className="text-gray-600 mb-8">Try adjusting your filters or search criteria</p>
                <button
                    onClick={onClearFilters}
                    className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300"
                >
                    CLEAR FILTERS
                </button>
            </div>
        );
    }

    return (
        <div className={`animate-fade-in ${viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'space-y-6'
            }`}>
            {products.map((product) => (
                viewMode === 'grid' ? (
                    <ProductCard key={product.id || product._id} product={product} />
                ) : (
                    // List View
                    <div key={product.id || product._id} className="flex items-center gap-6 p-6 border border-gray-100 hover:border-gray-300 transition-colors duration-300 group cursor-pointer">
                        <div className="w-24 h-24 bg-gray-100 flex-shrink-0 animate-scale-105-hover">
                            {product.imageUrl && product.imageUrl.length > 0 ? (
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/96x96/f3f4f6/9ca3af?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500">
                                    <div className="w-8 h-8 border border-black rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-light tracking-wide">{product.name}</h3>
                                {product.status && product.status !== 'active' && (
                                    <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium rounded">
                                        {product.status.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {product.description && (
                                <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                                    {product.description}
                                </p>
                            )}
                            <p className="text-gray-600 text-sm mb-2">Category: {product.category}</p>
                            <div className="flex items-center space-x-4">
                                <span className="text-xl font-light">${product.price}</span>
                                <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                                {product.stock === 0 && (
                                    <span className="text-sm text-red-600 font-medium">OUT OF STOCK</span>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product.id || product._id, product.name);
                            }}
                            className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                        </button>
                    </div>
                )
            ))}
        </div>
    );
};

export default ProductGrid;