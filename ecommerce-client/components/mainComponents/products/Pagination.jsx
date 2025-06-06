"use client"
import React from 'react';

/**
 * Pagination component provides navigation controls for paginated product results.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback for page changes
 * @param {boolean} props.loading - Loading state
 */
const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = totalPages > 1 ? getPageNumbers() : [];

  const handlePageClick = (page) => {
    if (page !== currentPage && !loading && page !== '...') {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-16 animate-fade-in">
      <nav className="flex items-center space-x-2">
        
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 text-sm font-medium tracking-wide border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-500"
        >
          PREVIOUS
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              disabled={loading || page === '...'}
              className={`w-10 h-10 text-sm font-medium tracking-wide border transition-all duration-300 disabled:cursor-default ${
                page === currentPage
                  ? 'bg-black text-white border-black'
                  : page === '...'
                  ? 'border-transparent cursor-default'
                  : 'border-gray-300 hover:border-black hover:bg-black hover:text-white disabled:opacity-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 text-sm font-medium tracking-wide border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-500"
        >
          NEXT
        </button>
      </nav>

      {/* Loading indicator for pagination */}
      {loading && (
        <div className="ml-4">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Pagination;