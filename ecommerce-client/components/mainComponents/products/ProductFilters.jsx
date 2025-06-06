"use client"
import React, { useState } from 'react';

/**
 * ProductFilters component handles category filtering, sorting, and view mode controls.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedCategory - Currently selected category
 * @param {string} props.sortBy - Current sort option
 * @param {string} props.viewMode - Current view mode (grid/list)
 * @param {Function} props.onCategoryChange - Callback for category changes
 * @param {Function} props.onSortChange - Callback for sort changes
 * @param {Function} props.onViewModeChange - Callback for view mode changes
 * @param {boolean} props.loading - Loading state
 */
const ProductFilters = ({
  selectedCategory,
  sortBy,
  viewMode,
  onCategoryChange,
  onSortChange,
  onViewModeChange,
  loading
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'ALL PRODUCTS' },
    { value: 'Electronics', label: 'ELECTRONICS' },
    { value: 'Clothing', label: 'CLOTHING' },
    { value: 'Home & Kitchen', label: 'HOME & KITCHEN' },
    { value: 'Books', label: 'BOOKS' },
    { value: 'Beauty & Personal Care', label: 'BEAUTY & PERSONAL CARE' },
    { value: 'Toys & Games', label: 'TOYS & GAMES' },
    { value: 'Sports & Outdoors', label: 'SPORTS & OUTDOORS' },
    { value: 'Health & Wellness', label: 'HEALTH & WELLNESS' },
    { value: 'Jewelry', label: 'JEWELRY' },
    { value: 'Automotive', label: 'AUTOMOTIVE' },
    { value: 'Other', label: 'OTHER' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'NAME A-Z' },
    { value: 'name-dec', label: 'NAME A-Z' },
    { value: 'price-asc', label: 'PRICE LOW TO HIGH' },
    { value: 'price-dec', label: 'PRICE HIGH TO LOW' },
    { value: 'createdAt-asc', label: 'NEWEST FIRST' }
  ];

  const handleCategorySelect = (categoryValue) => {
    if (!loading) {
      onCategoryChange(categoryValue);
      setIsCategoryDropdownOpen(false);
    }
  };

  const getCurrentCategoryLabel = () => {
    const category = categories.find(cat => cat.value === selectedCategory);
    return category ? category.label : 'ALL PRODUCTS';
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 animate-fade-in-up animate-delay-200">
      
      {/* Category Dropdown Filter */}
      <div className="relative">
        <button
          onClick={() => !loading && setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          disabled={loading}
          className={`flex items-center justify-between min-w-[200px] px-6 py-3 text-sm font-medium tracking-wide border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            selectedCategory !== 'all'
              ? 'bg-black text-white border-black'
              : 'border-gray-300 hover:border-black hover:bg-gray-50'
          }`}
        >
          <span>{getCurrentCategoryLabel()}</span>
          <svg 
            className={`w-4 h-4 ml-2 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isCategoryDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[250px] bg-white border border-gray-300 shadow-lg z-50 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategorySelect(category.value)}
                disabled={loading}
                className={`w-full text-left px-6 py-3 text-sm font-medium tracking-wide hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedCategory === category.value
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        {/* Overlay to close dropdown when clicking outside */}
        {isCategoryDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsCategoryDropdownOpen(false)}
          />
        )}
      </div>

      {/* Quick Category Buttons (Optional - for popular categories) */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 5).map((category) => (
          <button
            key={category.value}
            onClick={() => !loading && onCategoryChange(category.value)}
            disabled={loading}
            className={`px-4 py-2 text-xs font-medium tracking-wide border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedCategory === category.value
                ? 'bg-black text-white border-black'
                : 'border-gray-300 hover:border-black hover:bg-black hover:text-white'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Sort and View Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => !loading && onSortChange(e.target.value)}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 text-sm font-medium tracking-wide focus:outline-none focus:border-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex border border-gray-300">
          <button
            onClick={() => onViewModeChange('grid')}
            disabled={loading}
            className={`p-2 text-sm font-medium transition-colors duration-300 disabled:opacity-50 ${
              viewMode === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            disabled={loading}
            className={`p-2 text-sm font-medium transition-colors duration-300 disabled:opacity-50 ${
              viewMode === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;