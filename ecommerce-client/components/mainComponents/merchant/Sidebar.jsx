import React from 'react';
import { ShoppingBag, Clock, Settings, User, DollarSign } from 'lucide-react';
import QuickStats from './QuickStats';

const Sidebar = ({ merchantProfile, activeTab, setActiveTab, products }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium">{merchantProfile?.name}</h2>
              <p className="text-sm text-gray-500">{merchantProfile?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <ShoppingBag size={18} className="mr-3" />
                <span>Products</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('earnings')}
                className={`w-full flex items-center px-4 py-2 rounded-md ${activeTab === 'earnings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <DollarSign size={18} className="mr-3" />
                <span>Earnings</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('approvals')}
                className={`w-full flex items-center px-4 py-2 rounded-md ${activeTab === 'approvals' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Clock size={18} className="mr-3" />
                <span>Approval Status</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings size={18} className="mr-3" />
                <span>Profile Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <QuickStats products={products} />
    </div>
  );
};

export default Sidebar;