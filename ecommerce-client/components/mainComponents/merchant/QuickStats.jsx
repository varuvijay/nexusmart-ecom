import React from 'react';

const QuickStats = ({ products }) => {
  return (
    <div className="bg-white shadow rounded-lg mt-6 p-6">
      <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold">{products.filter(p => p.status === 'approved').length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold">{products.filter(p => p.status === 'pending').length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold">{products.filter(p => p.status === 'rejected').length}</p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;