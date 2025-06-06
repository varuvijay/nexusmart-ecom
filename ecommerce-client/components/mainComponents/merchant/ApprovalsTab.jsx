import React from 'react';
import StatusBadge from './StatusBadge';

const ApprovalsTab = ({ products, handleEditProduct }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Product Approval Status</h2>
      
      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <div className="flex items-center p-4 border-b">
              <div className="h-16 w-16 flex-shrink-0">
                <img 
                  className="h-16 w-16 rounded-md object-cover" 
                  src={product.imageUrl} 
                  alt={product.name} 
                />
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">Added on {new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50">
              <div className="flex items-center">
                <div className="flex-grow">
                  <h4 className="text-sm font-medium text-gray-700">Status Timeline</h4>
                  <div className="mt-2 flex items-center">
                    <div className={`h-2 w-2 rounded-full ${product.status === 'approved' ? 'bg-green-500' : product.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <div className="ml-2 text-sm text-gray-600">
                      {product.status === 'approved' 
                        ? 'Product approved and listed in the marketplace' 
                        : product.status === 'pending' 
                          ? 'Awaiting review by administrators' 
                          : 'Product rejected'}
                    </div>
                  </div>
                  {product.status === 'rejected' && product.rejectionReason && (
                    <div className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Reason:</span> {product.rejectionReason}
                    </div>
                  )}
                </div>
                
                {product.status === 'rejected' && (
                  <button 
                    onClick={() => handleEditProduct(product)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Edit & Resubmit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsTab;